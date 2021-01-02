const moment =require('moment')
module.exports={
formatDate:function(date,format){
return moment(date).format(format)

},
truncate:function(str,len){
    if(str.length>len){
        newstr=str.substr(0,len)
        return newstr
    }
    else{
        return str
    }

},
removetags:function(input){
return input.replace(/<(?:.|\n)*?>/gm,'')

},
editicon:function(storyUser,loggedUser,storyId,floating=true){
if(storyUser._id.toString()==loggedUser._id.toString())
{
if(floating){
    return `<a class="waves-effect waves-light btn-small"  href="/stories/edit/${storyId}">Edit</a>`}
else{
    return `<a class="waves-effect waves-light btn-small"  href="/stories/edit/${storyId}">Edit</a>`
}
}
else{

    return ''
}

},
}