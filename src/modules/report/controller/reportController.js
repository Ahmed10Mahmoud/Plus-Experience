import Report from '../../../../db/model/report.model.js'
export const createReport = async (req, res) => {
    try {
      const { userName, email, message } = req.body;
      const report = new Report({ userName, email, message });
      await report.save();
      res.status(201).json(report);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Failed to create report' });
    }
  };
  
  // Get all reports
export const getReports = async (req, res) => {
    try {
      const reports = await Report.find();
      res.status(200).json(reports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch reports' });
    }
  };
  
  // Get a single report by ID
export const getReportById = async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      res.status(200).json(report);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch report' });
    }
  };