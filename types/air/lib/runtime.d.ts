declare global {
  namespace runtime {
    type uint = number;

    namespace flash {
      namespace media {
        class StageWebView {}
      }

      namespace html {
        class HTMLLoader {}
      }

      namespace utils {
        class ByteArray {}
      }

      namespace net {
        class URLRequest {}
      }

      namespace crypto {
        function generateRandomBytes(numberRandomBytes: uint): utils.ByteArray;
      }
    }
  }
}

export = runtime;
