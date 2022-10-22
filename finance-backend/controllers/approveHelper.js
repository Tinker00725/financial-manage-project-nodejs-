const state = {
    0:{v:0,t:'进件'},
    1:{v:1,t:'提交初审'},
    2:{v:2,t:'初审通过'},
    3:{v:3,t:'初审拒绝'},
    4:{v:4,t:'提交终审'},
    5:{v:5,t:'终审通过'},
    6:{v:6,t:'终审拒绝'},
    7:{v:7,t:'生成合同'},
}

state[0].pass = state[1];
state[2].pass = state[4];
state[5].pass = state[7];
// 初审拒绝，返回初审申请
state[3].pass = state[1];
// 终审据绝，返回终审申请
state[6].pass = state[4]
// 提交终审的两种情况
state[4].pass = state[5];
state[4].reject = state[6]
// 提交初审后两种情况
state[1].pass = state[2];
state[1].reject = state[3];

// 1457这几步不能直接进入下一步
exports.waitingStaus = [1,4];
exports.nonCommit = [5,7]

exports.flowStatus = state;
