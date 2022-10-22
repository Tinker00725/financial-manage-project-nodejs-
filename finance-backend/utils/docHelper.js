var officegen = require("officegen");
var fs = require("fs");
var path = require("path");

const printFields = [
  {
    name: "姓名",
    value: "name",
  },
  {
    name: "身份证",
    value: "identity_card",
  },
  {
    name: "出生日期",
    value: "birthday",
  },
  {
    name: "性别",
    value: "sex",
  },
  {
    name: "婚姻状态",
    value: "marriage",
  },
  {
    name: "教育程度",
    value: "education",
  },
  {
    name: "居住地址",
    value: "address1",
  },
  {
    name: "户籍地址",
    value: "address2",
  },
  {
    name: "居住电话",
    value: "phone",
  },
  {
    name: "手机号",
    value: "mobile_phone",
  },
  {
    name: "现职公司全称",
    value: "company",
  },
  {
    name: "所属行业教育",
    value: "trade",
  },
  {
    name: "职位",
    value: "position",
  },
  {
    name: "公司地址",
    value: "address3",
  },
  {
    name: "公司类型",
    value: "company_type",
  },
  {
    name: "公司邮箱",
    value: "company_email",
  },
  {
    name: "公司电话",
    value: "company_phone",
  },
  {
    name: "收支情况",
    value: "income",
  },
  {
    name: "关系1",
    value: "contact",
  },
  {
    name: "姓名",
    value: "contact_name",
  },
  {
    name: "手机",
    value: "contact_phone",
  },
  {
    name: "关系2",
    value: "contact2",
  },
  {
    name: "姓名",
    value: "contact2_name",
  },
  {
    name: "手机",
    value: "contact2_phone",
  },
  {
    name: "部门",
    value: "contact2_dep",
  },
  {
    name: "职位",
    value: "contact2_pos",
  },
  {
    name: "备注",
    value: "remark",
  },
];

// 生成合同
/**
 *
 * @param {*} info
 * @param {*} filePath :path.join(__dirname, '../download/', `contract-${params.id}.docx`);
 */
function genContract(info, filePath) {
  return new Promise(async (resolve, reject) => {
    let docx = officegen("docx");
    docx.on("finalize", async function (written) {
      resolve();
    });
    docx.on("error", function (err) {
      reject(err);
    });

    // 标题
    let pObj = docx.createP({ align: "center" });
    pObj.addText("贷款合同书", {
      font_face: "Microsof YaHei",
      font_size: 28,
      color: "000000",
    });

    // 开头
    pObj = docx.createP({ align: "left" });
    pObj.addText("尊敬的", {
      font_face: "Microsof YaHei",
      blod: true,
      font_size: 16,
      color: "222222",
    });
    pObj.addText(`${info.name}:`, {
      font_face: "Microsof YaHei",
      blod: true,
      font_size: 16,
      color: "222222",
    });

    // 中间内容
    printFields.forEach(({ name, value }) => {
      if (name === "关系1") {
        docx.putPageBreak();
      }
      pObj = docx.createP({ align: "left" });
      pObj.addText(`${name}: ${info[value]}`, {
        font_face: "Microsof YaHei",
        font_size: 14,
        color: "333333",
      });
    });
    // 结尾
    pObj = docx.createP({ align: "right" });
    pObj.addText("申请人:", { font_size: 14 });
    pObj.addText(info.name, { underline: true, font_size: 14 });
    pObj = docx.createP({ align: "right" });

    console.group(info, info.create_time, "?????????????????????????????????");

    pObj.addText(info.create_time, {
      font_face: "Microsof YaHei",
      font_size: 14,
      color: "222222",
    });

    let out = fs.createWriteStream(filePath);
    docx.generate(out);
  });
}

exports.genContract = genContract;
