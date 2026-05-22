export const fetchRequest = async (url, {
  method = 'GET',
  body,
  headers = {},
} = {}) => {
  try {
    const isFormData = body instanceof FormData;

    const options = {
      method,
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...headers,
      },
    };

    if (body !== undefined) {
      options.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(url, options);

    //! Обработка случая "нет контента" (204)
    if(response.status === 204) {
      return null;
    }

    //! Пытаемся распарсить JSON, если он есть
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      //! Профессионально: прокидываем объект ошибки с данными от сервера
      const error = new Error(data?.message || `Ошибка ${response.status}`);
      error.status = response.status;
      console.log('response.status: ', response.status);
      error.data = data;
      throw error;
    }

    return data;

  } catch (error) {
    //! Здесь можно добавить логирование в Sentry или консоль
    console.error(`API Error [${method}] ${url}:`, error);
    // window.navigator.onLine
    console.log('window.navigator.onLine: ', window.navigator.onLine);
    throw error; //! Пробрасываем ошибку дальше для обработки в UI
  }
};

// export const fetchRequest = async (url, {
//   method = 'GET',
//   callback,
//   body,
//   headers,
// }) => {
//   try {
//     const options = {
//       method,
//     };

//     if (body) {
//       options.body = JSON.stringify(body);
//     }

//     if (headers) {
//       options.headers = headers;
//     }

//     const response = await fetch(url, options);

//     if (response.ok) {
//       const data = await response.json();
//       if (callback) return callback(null, data);
//       return;
//     }

//     throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
//   } catch (err) {
//     return callback(err);
//   }
// };