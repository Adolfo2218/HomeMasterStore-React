const base=require('./karma.conf.cjs');
module.exports = function(config){
 base(config);
 config.set({
  reporters:['progress','coverage'],
  coverageReporter:{dir:'coverage',reporters:[{type:'html',subdir:'html'},{type:'text-summary'},{type:'lcovonly',subdir:'.'}]},
  webpack:{mode:'development',devtool:'inline-source-map',module:{rules:[{test:/\.[jt]sx?$/,exclude:/node_modules/,use:{loader:'babel-loader',options:{presets:['@babel/preset-env',['@babel/preset-react',{runtime:'automatic'}]],plugins:['babel-plugin-istanbul']}}}]},resolve:{extensions:['.jsx','.js']}}
 });
}
