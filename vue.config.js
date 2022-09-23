module.exports = {

    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                logLevel:'debug',
                pathRewrite : {
                    '^/api':'/'
                }, 

            '^/dfmapi':{
                target:'http://10.172.17.51:9000',
                changeOrigin:true,
                logLevel:'debug',
                pathRewrite:{
                    '^/externalapi:9000':'/'
                }
            }
                      
               
           
            }
        }
    },
   
}