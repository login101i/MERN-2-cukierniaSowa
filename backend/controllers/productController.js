const Product = require('../models/product')
const ErrorHandler = require("../utils/ErrorHandler")
const catchAsynchErrors = require("../middlewares/catchAsyncErrors")
const APIFeatures = require("../utils/apiFeatures")





// Create new product   =>   /api/v1//products
// Get all products   =>   /api/v1/products?keyword=apple
exports.getProducts = catchAsynchErrors(async (req, res, next) => {

    const resPerPage = 9;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage)
    products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        productsCount,
        filteredProductsCount,
        products,
        resPerPage
    })

    // setTimeout(() => {
    //     res.status(200).json({
    //         success: true,
    //         productsCount,
    //         resPerPage,
    //         filteredProductsCount,
    //         products
    //     })
    // }, 2000)


})

// Create new product   =>   /api/v1/admin/product/new
exports.newProduct = catchAsynchErrors(async (req, res, next) => {

    // teraz dodaliśmy do modelu produktu user'a i możemy do req.body.user przypisać id użytkownika zalogowanego czyli req.user.id
    req.body.user = req.user.id

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})


// Create new product   =>   /api/v1//product/:id

exports.getSingleProduct = catchAsynchErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id)
    console.log(product)

    if (!product) {
        return next(new ErrorHandler("Nie odnaleziono produktu", 404))
    }

    res.status(200).json({
        success: true,
        product
    })

})

// Update Product   =>   /api/v1/admin/product/:id
exports.updateProduct = catchAsynchErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Nie odnaleziono produktu takiego produktu do zaktualizowania", 404))

    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })

})

// Delete Product   =>   /api/v1/admin/product/:id
exports.deleteProduct = catchAsynchErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Nie odnaleziono produktu do usunięcia", 404))

    }

    product = await product.remove()
    res.status(200).json({
        message: "Pomyślnie usunięto poniższy produkt",
        product
    })
})








// Create new product   =>   /api/v1//product/:id

exports.getSingleProduct = catchAsynchErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id)
    console.log(product)

    if (!product) {
        return next(new ErrorHandler("Nie odnaleziono produktu", 404))
    }

    res.status(200).json({
        success: true,
        product
    })

})

// Update Product   =>   /api/v1/admin/product/:id
exports.updateProduct = catchAsynchErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Nie odnaleziono produktu takiego produktu do zaktualizowania", 404))

    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })

})

// Delete Product   =>   /api/v1/admin/product/:id
exports.deleteProduct = catchAsynchErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Nie odnaleziono produktu do usunięcia", 404))

    }

    product = await product.remove()
    res.status(200).json({
        message: "Pomyślnie usunięto poniższy produkt",
        product
    })
})

// Create new review   =>   /api/v1/review
exports.createProductReview = catchAsynchErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }



    const product = await Product.findById(productId);
    console.log(product)

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }



    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: `Dodano opinię: ` + comment
    })

})

// Get Product Reviews => /api/v1 / reviews
exports.getProductReviews = catchAsynchErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    // cg czy req.query.id to to nie to samo co req.params.id ?

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})


// Delete Product Review => /api/v1 / reviews
exports.deleteReview = catchAsynchErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    // console.log(product);

    const removedReview = product.reviews.find(review => review._id.toString() === req.query.id.toString())
    console.log(removedReview)


    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
    // cg A skąd wzieło się tutaj query.id???? Czy to jest to samo co query productId .... aha .. można dać ?productId=1111?id=

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })




    res.status(200).json({
        success: true,
        message: "Usunięto opinię: " + removedReview.comment
    })
})