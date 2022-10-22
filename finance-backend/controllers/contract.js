const {
    findUserByNameStatusIn,
    countUserBynameStatusIn,
    findUserStatusIn,
    countUserStatusIn,
    findUserById,
    updateUserInfo,
} = require("../models/loan");
const fs = require('fs')
const { isExist } = require("../utils");
const { flowStatus } = require("./approveHelper");
// 增加可读性，终审通过、生成合同的
const APPROVED = 5,
    CONTRACT = 7;
const path = require("path");
const { genContract } = require("../utils/docHelper");
// 获取到status为5||7的用户信息
exports.getUser = async (ctx) => {
    // 1.获取信息，查询数据库
    const { pageNo, pageSize, name } = ctx.query;
    let start = (pageNo - 1) * pageSize;
    let length = +pageSize;
    if (name) {
        var res = await findUserByNameStatusIn(
            name,
            APPROVED,
            CONTRACT,
            start,
            length
        );
        var lengthRes = await countUserBynameStatusIn(name, APPROVED, CONTRACT);
    } else {
        var res = await findUserStatusIn(APPROVED, CONTRACT, start, length);
        var lengthRes = await countUserStatusIn(APPROVED, CONTRACT);
    }

    if (!res) return ctx.failed("查询失败");
    if (!lengthRes) return ctx.failed("长度查询失败");

    const rows = lengthRes[0].total;
    const pages = Math.ceil(rows / pageSize);
    ctx.success({
        info: "查询成功",
        data: {
            data: res,
        },
        pages,
    });
};

// 创建合同
exports.createFile = async (ctx) => {
    // 1.获取id，db查询status
    const { id } = ctx.request.body;
    let searchRes = await findUserById(id);
    if (searchRes.length !== 1) return ctx.failed("查询失败");
    // 2.当前status+1；
    let currentStatus = searchRes[0].status;
    const nextStaus = flowStatus[currentStatus].pass;
    if (currentStatus !== 5) return ctx.failed("当前状态无法生成合同");
    //3.判断合同是否存在，不存在则创建
    const filePath = path.join(__dirname, "../download/", `contracy-${id}.docx`);
    // 判断文件是否存在
    const existRes = isExist(filePath);

    let fileSuccess = true;
    const info = { ...searchRes[0] };
    // g字符串内符合的条件全局匹配, i忽略大小写
    info.create_time = new Date(info.create_time)
        .toLocaleDateString()
        .replace(/\//g, "-");
    info.update_time = new Date(info.create_time)
        .toLocaleDateString()
        .replace(/\//g, "-");

    // 不存在则创建
    if (!existRes) {
        try {
            await genContract(info, filePath);
            fileSuccess = true;
        } catch (e) {
            fileSuccess = false;
            console.log(e);
        }
    }
    if (!fileSuccess) return ctx.failed("合同创建失败");
    // 文件创建成功后返回最新的status
    let updateRes = await updateUserInfo({ status: nextStaus.v }, id);
    if (updateRes.affectedRows !== 1) return ctx.failed("更新状态失败");

    ctx.success("文件创建成功");
};

// 下载合同的url地址发送
exports.download = async ctx => {
    const {id} = ctx.query;
    // 1.判断文件是否存在
    const filePath = path.join(__dirname, "../download", `contracy-${id}.docx`);
    const existRes = isExist(filePath);
    if(!existRes) return ctx.failed('文件不存在')
    // 2.文件存在发送下载地址
    let downloadUrl = `/api/contract/download/contracy-${id}.docx`
    ctx.success({
        info:'获取成功',
        url:downloadUrl,
    })
}

// 下载合同
exports.downloadFile = async ctx => {
    let {fileName} = ctx.params;
    console.log('fileName:',fileName)
    const filePath = path.join(__dirname, "../download", fileName);
    console.log(filePath)
    // 1.判断文件是否存在
    const existRes = isExist(filePath);
    if(!existRes) return ctx.failed('文件不存在');
    // 2.文件存在返回该文件(readFileSync 同步读取文件)
    const buffer = fs.readFileSync(filePath);
    // 3.返回该文件
    ctx.body = buffer;

}
