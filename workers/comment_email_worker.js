const queue = require('../config/kue');

const commentMailer = require('../mailers/comments_mailer'); 

queue.process('emails',function(job,data){
    console.log('emails werker is processing a job',job.data); 
    commentMailer.newComment(job.data);
    done();
});