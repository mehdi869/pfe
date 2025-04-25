export const MapData = async (e) => {

    e.preventDefailt()

    const response = await fetch("http://localhost:8000/city/",{
        method : "GET",
        headers: {
            "Content-Type": "application/json",
         },
    })

    const data = await response.json()

    return data
}