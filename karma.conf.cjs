module.exports = function(config) {
 config.set({frameworks:['jasmine'],files:['src/tests/*.spec.jsx'],preprocessors:{'src/tests/*.spec.jsx':['webpack']},webpack:{mode:'development',module:{rules:[{test:/\.[jt]sx?$/,exclude:/node_modules/,use:{loader:'babel-loader',options:{presets:['@babel/preset-env',['@babel/preset-react',{runtime:'automatic'}]]}}}]},resolve:{extensions:['.jsx','.js']}},reporters:['progress'],browsers:['ChromeHeadless'],singleRun:true,client:{clearContext:false}})
}
