function systemAdminAuth(req,res,next){
    if(req.session.userType=='systemAdmin'){
        next()
    }else{
        res.redirect('/login/admin')
    }
}


function eventAdminAuth(req,res,next){
    if(req.session.userType=='eventAdmin'){
        next()
    }else{
        res.redirect('/login')
    }
}

function exhibitorAuth(req,res,next){
    if(req.session.userType=='exhibitor'){
        next()
    }else{
        res.redirect('/login')
    }
}

module.exports = {
    systemAdmin:systemAdminAuth,
    exhibitor:exhibitorAuth,
    eventAdmin:eventAdminAuth   
}
