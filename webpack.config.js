module.exports = {
 entry: {
   "mdautolink": './Application/mdautolink.ts'
 },
 output: {
   filename: "[name].js",
   path: __dirname + '/Distribution'
 },
 target: 'node',
 mode: 'production',
 module: {
   rules: [
     {
       test: /\.tsx?$/,
       use: ['babel-loader', 'ts-loader'],
       exclude: /node_modules/,
     },
   ]
 },
 resolve: {
   extensions: [".tsx", ".ts", ".js", ".json"]
 },
};
