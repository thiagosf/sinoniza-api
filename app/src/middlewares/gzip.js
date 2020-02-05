import expressStaticGzip from 'express-static-gzip'
import path from 'path'

export default expressStaticGzip(path.join(__dirname, '../../public'), {
  index: false
})
