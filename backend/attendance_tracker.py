
from openpyxl import Workbook, load_workbook
import os
from datetime import date

def update_attendance(name, engagement, remarks, posture_status):
    """Update the attendance Excel file with student data"""
    try:
        today = date.today().strftime("%Y-%m-%d")
        filename = "attendance.xlsx"
        
        if not os.path.exists(filename):
            wb = Workbook()
            sheet = wb.active
            sheet.title = "Attendance"
            sheet.append(["Date", "Name", "Status", "Engagement", "Remarks", "Posture"])
            wb.save(filename)

        wb = load_workbook(filename)
        sheet = wb.active
        
        # Append new data including posture
        sheet.append([today, name, "Present", engagement, remarks, posture_status])
        wb.save(filename)

    except Exception as e:
        print(f"Error updating attendance: {e}")

def get_attendance_records():
    """Get all attendance records from the Excel file"""
    if not os.path.exists('attendance.xlsx'):
        return []

    wb = load_workbook('attendance.xlsx')
    sheet = wb.active

    data = []
    for row in sheet.iter_rows(min_row=2, values_only=True):  # Skip header
        data.append({
            'date': row[0],
            'name': row[1],
            'status': row[2],
            'engagement': row[3],
            'remarks': row[4],
            'posture': row[5] if len(row) > 5 else "Not recorded"
        })

    return data
