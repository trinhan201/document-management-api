import ReqChangeInfo from '../models/ReqChangeInfo.js';
import User from '../models/User.js';

// Create req data controller
export const createReqChangeInfoController = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (currentUser.isActived === false)
            return res.status(403).json({ code: 403, message: 'Tài khoản tạm thời bị vô hiệu hóa' });
        const newReqData = new ReqChangeInfo(req.body);

        await newReqData.save();
        res.status(200).json({ code: 200, message: 'Gửi yêu cầu thành công', data: newReqData });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Get all req data controller
export const getAllReqChangeInfoController = async (req, res) => {
    try {
        const reqData = await ReqChangeInfo.find({}).sort({ createdAt: -1 });
        const pendingData = reqData?.filter((item) => item.status === 'pending');
        const approvedData = reqData?.filter((item) => item.status === 'approved');
        const rejectedData = reqData?.filter((item) => item.status === 'rejected');
        res.status(200).json({
            code: 200,
            allReqData: reqData,
            pendingData: pendingData,
            approvedData: approvedData,
            rejectedData: rejectedData,
        });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Change req data status controller
export const changeReqChangeInfoStatusController = async (req, res) => {
    try {
        const reqDataId = req.params.reqDataId;
        const status = req.body.status;
        const reqData = await ReqChangeInfo.findById(reqDataId);
        if (!reqData) return res.status(404).json({ code: 404, message: 'Not found' });
        await ReqChangeInfo.findByIdAndUpdate(reqDataId, { status: status });
        res.status(200).json({ code: 200, message: status === 'approved' ? 'Chấp nhận' : 'Từ chối' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};

// Delete req data controller
export const deleteReqChangeInfoController = async (req, res) => {
    try {
        const reqDataId = req.params.reqDataId;
        const reqData = await ReqChangeInfo.findById(reqDataId);
        if (!reqData) return res.status(404).json({ code: 404, message: 'Không tìm thấy yêu cầu' });

        await ReqChangeInfo.findByIdAndDelete(reqDataId);
        res.status(200).json({ code: 200, message: 'Đã xóa thành công yêu cầu' });
    } catch (error) {
        res.status(400).json({ code: 400, message: 'Unexpected error' });
        console.log(error);
    }
};
