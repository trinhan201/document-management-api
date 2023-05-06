export const isAdmin = (req, res, next) => {
    let role = req.user.role;
    if (role === 'Admin') {
        next();
    } else {
        return res.status(401).json({
            code: 401,
            message: 'NOT PERMISSION',
        });
    }
};

export const isModerator = (req, res, next) => {
    let role = req.user.role;
    if (role === 'Admin' || role === 'Moderator') {
        next();
    } else {
        return res.status(401).json({
            code: 401,
            message: 'NOT PERMISSION',
        });
    }
};

export const isMember = (req, res, next) => {
    let role = req.user.role;
    if (role === 'Admin' || role === 'Moderator' || role === 'Member') {
        next();
    } else {
        return res.status(401).json({
            code: 401,
            message: 'NOT PERMISSION',
        });
    }
};
