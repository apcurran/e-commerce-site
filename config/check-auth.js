export function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    req.session.oldUrl = req.url;

    return res.redirect("/user/login");
}

export function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }

    return next();
}

export function checkAdminAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        return next();
    }

    req.session.oldUrl = req.url;

    return res.redirect("/admin/login");
}
