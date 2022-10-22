# 1.后端文件分类最好符合mvc结构
    视图层、控制层、数据层分开撰写
# 2.登录流程
    获取用户名、密码——用户名查找数据库——获取到的账户密码对比——登录成功——派发token
# 3.响应规范
    为了响应的复用与规范，我们会把响应的文字入一个封装函数，并且传入已经沟通好的状态码
    所以我们对ctx进行添加方法，用于复用响应与规范响应的写法。（responseHandler）
# 4.token第三方包：jsonwebtoken
    token的业务逻辑：生成token、验证token、解码token
# 5.中间件 await next()
    next()相当于把这个中间件后后面的代码引入到这个位置
    所以当直接next（）但是后面的中间件/路由挂载引入的时候
    就会直接导致返回一个promise,
    即：
    ## 方异步程序执行失败（但这个问题不会报错，所以推荐一直使用await next()）
    但是加了await就可以很好的解决后方程序异步的问题。
    所以：koa建议所有的next()都采用await next() 的方式。
# 6.koa 404原因汇总
    1.中间件该返回await next() 的地方没有await next()
    2.await next() 写成了 next()
    3.相应路由没有返回(ctx.body = ···)
    4.路由没有加/
    5.路由的请求方式get、post错误
# 7.退出登录的token
    退出登录的token存储在global里面，但是不能做到删除同一账号再次删除的效果。只能删除真正过期掉的token
# 8. ctx上挂载方法→app.context里挂函数即可

# 9.只有db操作
    插入数据独有的监测方式：if（result.affectedRows !== 1）

# 10.写新接口步骤
    路由→app引入挂载→controllers→返回
# 11.affectedRows的使用
    一般用于DELETE, INSERT , REPLACE , UPDATE语句执行完成之后判断数据表中变化的行数（如果数据表没有变化，则行数为0）。
# 12.mysql中的更新时间
    在sql语句中 变量=now();就是mysql中数据更新的时间
# 13.sql语句往后都推荐进行失败验证
# 14.为什么用链表
    业务功能就是点击提交审核实现后台status的状态转换，但是状态的跳转又不是线性的，一个个写又太繁琐了，不具有可靠性，不利于维护，
    所以使用链表。链表具有不连续的特点，可以实现蜘蛛网跳转。
# 15.and运算符
    sql多条件的时候可以用作条件连接
# 16.计算条件sql的查询总数
    count(*) as total 最后用total给变量赋值。
# 17.sql语句写的更加通用有利于复用。
# 18.readFileSync()、readFile（）
    前者同步，后者异步
    
    