import axios from 'axios'
import cheerio from 'cheerio'

/**
 * Crawler para resgatar dados do site
 * https://www.sinonimos.com.br/
 * @class
 */
class SinonimosCrawler {
  static URL = 'https://www.sinonimos.com.br'

  /**
   * Um sinonimo da palavra
   * @typedef {object} Synonym
   * @property {string} synonym Sinonimo
   * @property {string} meaning Sentido da palavrado
   */

  /**
   * Busca sinonimos
   * @param {string} word
   * @returns {Promise<Synonym[]>}
   */
  async search (word) {
    const html = await this.doRequest(word)
    const synonyms = await this.parseSynonyms(html)
    return synonyms
  }

  /**
   * Faz request no site
   * @param {string} word
   * @returns {Promise<string>}
   */
  async doRequest (word) {
    if (
      process.env.NODE_ENV === 'test' &&
      process.env.FORCE_REQUEST !== 'true'
    ) {
      return require('fs').readFileSync(
        require('path').join(
          __dirname,
          '../../test/fixtures/sinonimos',
          'esperto.html'
        )
      ).toString()
    } else {
      const userAgent = this.randomUserAgent()
      const instance = axios.create({
        baseURL: SinonimosCrawler.URL,
        timeout: 5000,
        headers: {
          'User-Agent': userAgent,
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3'
        }
      })
      try {
        const response = await instance.get(`/${word}`, {
          responseType: 'arraybuffer'
        })
        return response.data.toString('latin1')
      } catch (error) {
        console.log('-- doRequest error:', word, error.message)
        return ''
      }
    }
  }

  /**
   * Analiza o html e retorna os sinonimos
   * @param {string} html
   * @returns {Promise<string>}
   */
  async parseSynonyms (html) {
    let output = []
    const $ = cheerio.load(html)
    const groups = $('.s-wrapper')
    groups.each(function () {
      let meaning = $(this).find('.sentido').text().trim()
      const synonyms = $(this).find('.sinonimos .sinonimo')
      if (meaning) {
        meaning = meaning.replace(/:/g, '').trim()
        synonyms.each(function () {
          const synonym = $(this).text().trim()
          output.push({
            meaning,
            synonym
          })
        })
      }
    })
    return output
  }

  /**
   * Retorn user agent aleatorio
   * @returns {string}
   */
  randomUserAgent () {
    const list = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:72.0) Gecko/20100101 Firefox/72.0'
    ]
    const random = Math.floor(Math.random() * list.length)
    return list[random]
  }
}

export default SinonimosCrawler
