// Sample product data with color images and free delivery flag
const products = [
    {
        id: 1,
        title: "Black Color Cap",
        slug: "black-color-cap",
        price: 599,
        originalPrice: 799,
        image: "https://i.postimg.cc/sxPHbc9t/Black-Color-Cap-6.png",
        images: [
            "https://i.postimg.cc/hvKRvf4c/Cuatomizes-Cap-Black-2.jpg",
            "https://i.postimg.cc/QMpXMLgg/Cuatomizes-Cap-Black-3.jpg",
            "https://i.postimg.cc/FKcKJkvL/Cuatomizes-Cap-Black-4.jpg",
            "https://i.postimg.cc/gJ86dBj1/Cuatomizes-Cap-Black-5.jpg"
        ],
        description: "Comfortable and stylish men's casual t-shirt made from 100% cotton. Available in various colors and sizes.",
        colors: ["Red", "Blue", "Black", "White", "Green"],
        colorImages: {
            "Red": "https://static.vecteezy.com/system/resources/thumbnails/008/533/992/small_2x/red-cap-mockup-cutout-file-png.png",
            "Blue": "https://www.shutterstock.com/image-photo/baseball-cap-isolated-on-white-600nw-610601909.jpg",
            "Black": "https://t3.ftcdn.net/jpg/02/72/20/82/360_F_272208218_pS249ZTq8cu3yknECXm0K3U8UtOIBVvr.jpg",
            "White": "https://3.imimg.com/data3/AY/WT/MY-13475627/white-cap.jpg",
            "Green": "https://m.media-amazon.com/images/I/613zrbW8OrL._AC_SL1001_.jpg"
        },
        colorCodes: {
            "Red": "#ff0000",
            "Blue": "#0000ff",
            "Black": "#000000",
            "White": "#ffffff",
            "Green": "#00ff00"
        },
        sizes: ["S", "M", "L", "XL"],
        stock: 15,
        deliveryFree: true
    },
    {
        id: 2,
        title: "Khaki Cap",
        slug: "khaki-cap",
        price: 599,
        originalPrice: 799,
        image: "https://i.postimg.cc/Wpf7bxtX/Khaki-Cap-9.png",
        images: [
            "https://i.postimg.cc/dVJ1TV1H/Customizes-Cap-Khaki-2.jpg",
            "https://i.postimg.cc/wMTzj7FL/Customizes-Cap-Khaki-3.jpg",
            "https://i.postimg.cc/FzRtQwsx/Customizes-Cap-Khaki-4.jpg",
            "https://i.postimg.cc/pXrxN5mt/Customizes-Cap-Khaki-5.jpg"
        ],
        description: "Comfortable and stylish men's casual t-shirt made from 100% cotton. Available in various colors and sizes.",
        colors: ["Red", "Blue", "Black", "White", "Green"],
        colorImages: {
            "Red": "https://static.vecteezy.com/system/resources/thumbnails/008/533/992/small_2x/red-cap-mockup-cutout-file-png.png",
            "Blue": "https://www.shutterstock.com/image-photo/baseball-cap-isolated-on-white-600nw-610601909.jpg",
            "Black": "https://t3.ftcdn.net/jpg/02/72/20/82/360_F_272208218_pS249ZTq8cu3yknECXm0K3U8UtOIBVvr.jpg",
            "White": "https://3.imimg.com/data3/AY/WT/MY-13475627/white-cap.jpg",
            "Green": "https://m.media-amazon.com/images/I/613zrbW8OrL._AC_SL1001_.jpg"
        },
        colorCodes: {
            "Red": "#ff0000",
            "Blue": "#0000ff",
            "Black": "#000000",
            "White": "#ffffff",
            "Green": "#00ff00"
        },
        sizes: ["S", "M", "L"],
        stock: 8,
        deliveryFree: false
    }
];
