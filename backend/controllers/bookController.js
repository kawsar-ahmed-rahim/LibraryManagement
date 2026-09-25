import Issue from "../models/Issue.js";
import User from "../models/User.js";
import FineSetting from "../models/FineSetting.js";

// Helper functions

// 1. Issue manual books to a student
export async function issueManualBooks(req, res){
    try {
        const { studentDetails, books} = req.body;
        if(!Array.isarray(books) || books.length === 0){
            return res.status(400).json({message: "No book were entered"})
        }

        const student = await User.findOne({rollNo: studentDetails.rollNumber});
        if(!student) return res.status(404).json({
            success: false,
            message: "Student not found"
        })
        const todayIso = getLocalIsoDate();
        const validBooks = books.filter(b => b.title && b.bookCode && b.dueDate);
        if(validBooks.length === 0){
            return res.status(400).json({
                message: "Please add at least one valid manual book entry with book code and a due date"
            })
        }




        res.status(201).json({
            success: true,
            message: `${createdIssues.length} manual books issued successfully`,
            count: createdIssues.length,
            issues: createdIssues
        })
    } catch (error) {
        console.log("Error issuing manual books:", error);
    res.status(500).json({
      success: false,
      message: "Error issuing manual books", error: error.message
    });
    }
}
// get all the manual issues (admin)