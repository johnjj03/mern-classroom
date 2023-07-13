const getLabs = async (params,credentials,signal) => {
    try{
        let response = await fetch('/api/labs', {
            method: 'GET',
            signal: signal,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + credentials.t
            }
          })
          return await response.json()
    }
    catch(err){
        console.log(err)
    }
}

export {
    getLabs
}