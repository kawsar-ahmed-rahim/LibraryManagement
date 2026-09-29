import Issue from "../models/Issue.js";
import User from "../models/User.js";
import FineSetting from "../models/FineSetting.js";

// Helper functions

// 1. Issue manual books to a student
export async function issueManualBooks(req, res) {
  try {
    const { studentDetails, books } = req.body;
    if (!Array.isarray(books) || books.length === 0) {
      return res.status(400).json({ message: "No book were entered" });
    }

    const student = await User.findOne({ rollNo: studentDetails.rollNumber });
    if (!student)
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    const todayIso = getLocalIsoDate();
    const validBooks = books.filter((b) => b.title && b.bookCode && b.dueDate);
    if (validBooks.length === 0) {
      return res.status(400).json({
        message:
          "Please add at least one valid manual book entry with book code and a due date",
      });
    }
    const getLocalIsoDate = (value = new Date()) => {
      const d = new Date(value);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const getStartOfDay = (value) =>
      new Date(new Date(value).setHours(0, 0, 0, 0));

    const getDiffInDays = (targetDateString) =>
      Math.round(
        (getStartOfDay(targetDateString) - getStartOfDay(new Date())) /
          86400000,
      );

    const getOverdueUnits = (overdueDays, interval) => {
      if (overdueDays <= 0) return 0;
      const divisor = { week: 7, month: 30, year: 365 }[interval] || 1;
      return Math.ceil(overdueDays / divisor);
    };

    const calculateFine = (issue, fineRate = 10, fineInterval = "day") => {
      if (!issue || issue.fineCleared || issue.returnedOn) return 0;
      const overdueDays = Math.max(0, -getDiffInDays(issue.dueDate));
      return (
        getOverdueUnits(overdueDays, fineInterval) * fineRate +
        (Number(issue.manualFine) || 0)
      );
    };

    res.status(201).json({
      success: true,
      message: `${createdIssues.length} manual books issued successfully`,
      count: createdIssues.length,
      issues: createdIssues,
    });
  } catch (error) {
    console.log("Error issuing manual books:", error);
    res.status(500).json({
      success: false,
      message: "Error issuing manual books",
      error: error.message,
    });
  }
}
// get all the manual issues (admin)

export async function getIssues(req, res) {
  try {
    const issues = await Issue.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      issues,
    });
  } catch (error) {
    console.log("Error issuing manual issues:", error);
    res.status(500).json({
      success: false,
      message: "Error issuing manual issues",
      error: error.message,
    });
  }
}

// get manual issues for logged in student
export async function getStudentIssues(req, res) {
  try {
    const issues = await Issue.find({
      userEmail: req.user.email.toLowerCase().trim(),
    }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      issues,
    });
  } catch (error) {
    console.log("Error issuing student issues:", error);
    res.status(500).json({
      success: false,
      message: "Error issuing student issues",
      error: error.message,
    });
  }
}

// return issued manual book
export async function returnBook(req, res) {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue)
      return res.status(404).json({ message: "Issue record not found" });

    if (issue.returnedOn)
      return res.status(400).json({
        message: "Book already returned",
      });
    issue.returnedOn = getLocalIsoDate();
    await issue.save();
    res.status(200).json({
      success: true,
      message: "Book returned successfully",
      issue,
    });
  } catch (error) {
    console.log("Error returning manual book:", error);
    res.status(500).json({
      success: false,
      message: "Error returning manual book",
      error: error.message,
    });
  }
}

// apply manual fine
export async function applyFine(req, res) {
  try {
    const fineAmount = Number(req.body.amount);
    if (Number.isNaN(fineAmount))
      return res.status(400).json({
        message: "Invalid fine amount",
      });
    const issue = await Issue.findById(req.params.id);
    if (!issue)
      return res.status(404).json({ message: "Issue record not found" });

    issue.manualFine = fineAmount;
    if (fineAmount > 0) issue.fineCleared = false;
    await issue.save();

    res.status(200).json({
      success: true,
      message: "Manual fine applied successfully",
      issue,
    });
  } catch (error) {
    console.log("Error applying manual fine:", error);
    res.status(500).json({
      success: false,
      message: "Error applying manual fine",
      error: error.message,
    });
  }
}

// clear manual fine
export async function clearFine(req, res) {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue)
      return res.status(404).json({ message: "Issue record not found" });

    Object.assign(issue, {
      manualFine: 0,
      fineCleared: true,
      clearedFineAmount: calculateFine(
        issue,
        issue.fineRate,
        issue.fineInterval,
      ),
    });
    await issue.save();
    res.status(200).json({
      success: true,
      message: "Fine cleared successfully",
      issue,
    });
  } catch (error) {
    console.log("Error clearing manual fine:", error);
    res.status(500).json({
      success: false,
      message: "Error  clearing manual fine",
      error: error.message,
    });
  }
}

// get active fine setting
export async function getFineSettings(req, res){
  try {
    const settings = (await FineSetting.findOne({}) || (
      await FineSetting.create({ amount: 10, interval: "day"})
    ));
    res.status(200).json({ success: true, settings})
  } catch (error) {
    console.log("Error fetching fine settings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching fine settings",
      error: error.message,
    });
  }
}

// to update fine settings
export async function updateFineSettings(req, res){
  try {
    const {amount, interval} = req.body;
    let settings = await FineSetting.findOne({});
    if(settings){
      if(amount !== undefined) settings.amount = Number(amount);
      if(interval !== undefined) settings.interval = interval;
      await settings.save();
    }else {
      settings = await FineSetting.create({amount: Number(amount) || 10, interval: interval || "day"});
    }
    res.status(200).json({ success: true, message: "Fine settings updated successfully", settings})
  } catch (error) {
    console.log("Error updating fine setting:", error);
    res.status(500).json({
      success: false,
      message: "Error updating fine setting",
      error: error.message,
    });
  }
}