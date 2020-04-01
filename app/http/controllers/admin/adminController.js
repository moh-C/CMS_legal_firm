const controller = require('app/http/controller');
const Comment = require('app/models/comments');
const User = require('app/models/users');
const Report = require('app/models/reports');


class adminController extends controller
{
    async index(req, res) 
    {
        let page = req.query.page || 1;
        const title = 'پنل مدیریت';
        let comments = await Comment.paginate({}, { page , sort: {createdAt : -1} , limit: 7, populate: 'user'});
        res.render('admin/admin', {title, comments});
    }

    async list(req, res)
    {
        let page = req.query.page || 1;
        let comments = await Comment.paginate({}, { page , sort: {createdAt : -1} , limit: 7, populate: 'user'});
        const title = 'مدیریت پیام ها';
        res.render('admin/list', {title, comments});
    }

    async members(req, res)
    {
        let page = req.query.page || 1;
        let users = await User.paginate({}, { page , sort: {createdAt : 1} , limit: 7, populate: 'comments'});
        const title = 'اعضا';
        res.render('admin/members', {title, users});
    }

    async members2(req, res)
    {
        let page = req.query.page || 1;
        let comments = await Comment.paginate({}, { page , sort: {createdAt : 1} , limit: 7, populate: 'user'});
        const title = 'اعضا';
        let id = req.params.id;
        const errors = req.flash('errors');
        const message = req.flash('success');
        res.render('admin/members_m', {title, comments, id, errors, message});
    }
    async checked(req, res)
    {
        const title = 'گزارشات';
        let page = req.query.page || 1;
        let comments = await Comment.paginate({}, { page , sort: {createdAt : 1} , limit: 7, populate: 'user'});
        res.render('admin/checked', {title, comments});  
    }

    async reports(req, res)
    {
        let page = req.query.page || 1;
        let reports = await Report.paginate({}, { page , sort: {createdAt : -1} , limit: 7});
        const title = 'گزارشات';
        res.render('admin/reports', {title, reports});  
    }

    async view(req,res ,next)
    {
        let page = req.query.page || 1;
        let comments = await Comment.paginate({}, { page , sort: {createdAt : 1} , limit: 7, populate: 'user'});;
        let id = req.params.id;
        if(! comments){
            res.json('چنین صفحه ای ای وجود ندارد');
        }
        const title = 'صندوق شکایات';
        return res.render('admin/users', {title, comments, id});
}
async reply(req, res, next)
    {
        let id = req.params.id;
        let url = req.originalUrl;
        let status = await this.validationData(req);
        if(!status)
            return res.redirect(url);
        
        let {response} = req.body;
        Comment.findByIdAndUpdate(id,{$set:{checked: true, respond: response}}, function(err, result){
            if(err){
            console.log(err);
        } });
        let message = ['پاسخ شما با موفقیت ثبت شد']
        req.flash('success', message);
         return res.redirect(url);
    }
    
    // async search(req, res) {
    //     let {searchbar} = req.body;
    //     let page = req.query.page || 1;
    //     let comments = await Comment.paginate({}, { page , sort: {createdAt : 1} , limit: 7, populate: 'user'});
    //     let search = comments.find({username: searchbar, body: searchbar});
    //     res.sender('/admin/')
    //     return search;
    // }
    
}


module.exports = new adminController();