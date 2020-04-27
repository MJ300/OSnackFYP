export class oAddress {
    id = 0;
    name = "";
    firstLine = "";
    secondLine = "";
    city = "";
    postcode = "";
    userId = 0;

    constructor(address = {
        id: 0,
        name: "",
        firstLine: "",
        secondLine: "",
        city: "",
        postcode: "",
        userId: 0,
    }) {
        this.id = address.id;
        this.name = address.name;
        this.firstLine = address.firstLine;
        this.secondLine = address.secondLine;
        this.city = address.city;
        this.postcode = address.postcode;
        this.userId = address.userId;
    }
}

export class oAppLog {
    id = 0;
    timeStamp = "";
    massage = "";
    user = new oUser();

    constructor(appLog = {
        id: 0,
        timeStamp: "",
        massage: "",
        user: new oUser(),
    }) {
        this.id = appLog.id;
        this.timeStamp = appLog.timeStamp;
        this.massage = appLog.massage;
        this.user = appLog.user;
    }
}

export class oCategory {
    id = 0;
    name = "";
    price = 0;
    unit = "";
    imagePath = "";
    active = false;
    products = [];
    byteString = "";

    constructor(category = {
        id: 0,
        name: "",
        price: 0,
        unit: "",
        imagePath: "",
        active: false,
        products: [],
        byteString: "",
    }) {
        this.id = category.id;
        this.name = category.name;
        this.price = category.price;
        this.unit = category.unit;
        this.imagePath = category.imagePath;
        this.active = category.active;
        this.products = category.products;
        this.byteString = category.byteString;
    }
}

export class oComment {
    id = 0;
    description = "";
    orderItem = new oOrderItem();

    constructor(comment = {
        id: 0,
        description: "",
        orderItem: new oOrderItem(),
    }) {
        this.id = comment.id;
        this.description = comment.description;
        this.orderItem = comment.orderItem;
    }
}

export class oNewsletterSubscription {
    email = "";
    displayName = "";
    token = new oToken();

    constructor(newsletterSubscription = {
        email: "",
        displayName: "",
        token: new oToken(),
    }) {
        this.email = newsletterSubscription.email;
        this.displayName = newsletterSubscription.displayName;
        this.token = newsletterSubscription.token;
    }
}

export class oOrder {
    id = 0;
    date = new Date();
    status = 0;
    totalPrice = 0;
    address = new Address();
    payment = new Payment();
    coupon = new Coupon();
    orderItems = [];

    constructor(order = {
        id: 0,
        date: new Date(),
        status: 0,
        totalPrice: 0,
        address: new Address(),
        payment: new Payment(),
        coupon: new Coupon(),
        orderItems: [],
    }) {
        this.id = order.id;
        this.date = order.date;
        this.status = order.status;
        this.totalPrice = order.totalPrice;
        this.address = order.address;
        this.payment = order.payment;
        this.coupon = order.coupon;
        this.orderItems = order.orderItems;
    }
}

export class oOrderItem {
    id = 0;
    quantity = 0;
    order = new Order();
    product = new Product();
    comments = [];
    scores = [];

    constructor(orderItem = {
        id: 0,
        quantity: 0,
        order: new Order(),
        product: new Product(),
        comments: [],
        scores: [],
    }) {
        this.id = orderItem.id;
        this.quantity = orderItem.quantity;
        this.order = orderItem.order;
        this.product = orderItem.product;
        this.comments = orderItem.comments;
        this.scores = orderItem.scores;
    }
}

export class oPayment {
    id = 0;
    paymentProvider = "";
    reference = "";
    dateTime = new Date();
    order = new oOrder();

    constructor(payment = {
        id: 0,
        paymentProvider: "",
        reference: "",
        dateTime: new Date(),
        order: new oOrder(),
    }) {
        this.id = payment.id;
        this.paymentProvider = payment.paymentProvider;
        this.reference = payment.reference;
        this.dateTime = payment.dateTime;
        this.order = payment.order;
    }
}

export class oProduct {
    id = 0;
    name = "";
    description = "";
    imagePath = "";
    active = false;
    price = 0;
    unitQuantity = 0;
    unit = 0;
    storageItems = [];
    averageRate = 5;
    comments = [];

    constructor(product = {
        id: 0,
        name: "",
        description: "",
        imagePath: "",
        active: false,
        price: 0,
        unitQuantity: 0,
        unit: 0,
        category: new oCategory(),
        storageItems: [],
        averageRate: 5,
        comments: [],
    }) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.imagePath = product.imagePath;
        this.active = product.active;
        this.price = product.price;
        this.unitQuantity = product.unitQuantity;
        this.unit = product.unit;
        this.category = product.category;
        this.storageItems = product.storageItems;
        this.averageRate = product.averageRate;
        this.comments = product.comments;
    }
}

export class oRole {
    id = 0;
    name = "";
    accessClaim = "";

    constructor(role = {
        id: 0,
        name: "",
        accessClaim: "",
    }) {
        this.id = role.id;
        this.name = role.name;
        this.accessClaim = role.accessClaim;
    }
}

export class oScore {
    orderItemId = 0;
    rate = 5;
    userId = 0;

    constructor(score = {
        orderItemId: 0,
        rate: 5,
        userId: 0,
    }) {
        this.orderItemId = score.orderItemId;
        this.rate = score.rate;
        this.userId = score.userId;
    }
}

export class oStorage {
    id = 0;
    name = "";

    constructor(storage = {
        id: 0,
        name: "",
    }) {
        this.id = storage.id;
        this.name = storage.name;
    }
}

export class oStorageItem {
    storageId = 0;
    productId = 0;

    constructor(storageItem = {
        storageId: 0,
        productId: 0,
    }) {
        this.storageId = storageItem.storageId;
        this.productId = storageItem.productId;
    }
}

export class oToken {
    id = 0;
    value = "";
    valueType = 0;
    expiaryDateTime = new Date();
    user = null;
    email = "";

    constructor(token = {
        id: 0,
        value: "",
        valueType: 0,
        expiaryDateTime: new Date(),
        user: null,
        email: "",
    }) {
        this.id = token.id;
        this.value = token.value;
        this.valueType = token.valueType;
        this.expiaryDateTime = token.expiaryDateTime;
        this.user = token.user;
        this.email = token.email;
    }
}

export class oUser {
    id = 0;
    firstName = "";
    surename = "";
    registeredDate = new Date();
    role = new oRole();
    password = "";
    phoneNumber = "";
    email = "";
    addresses = [];

    constructor(user = {
        id: 0,
        firstName: "",
        surename: "",
        registeredDate: new Date(),
        role: new oRole(),
        password: "",
        phoneNumber: "",
        email: "",
        addresses: [],
    }) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.surename = user.surename;
        this.registeredDate = user.registeredDate;
        this.role = user.role;
        this.password = user.password;
        this.phoneNumber = user.phoneNumber;
        this.email = user.email;
        this.addresses = user.addresses;
    }
}


