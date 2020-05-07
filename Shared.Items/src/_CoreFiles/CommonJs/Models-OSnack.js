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
   unit = 0;
   unitQuantity = 0;
   imagePath = "";
   status = false;
   products = [];
   imageBase64 = "";

   constructor(category = {
      id: 0,
      name: "",
      price: 0,
      unit: 0,
      unitQuantity: 0,
      imagePath: "",
      status: false,
      products: [],
      imageBase64: "",
   }) {
      this.id = category.id;
      this.name = category.name;
      this.price = category.price;
      this.unit = category.unit;
      this.unitQuantity = category.unitQuantity;
      this.imagePath = category.imagePath;
      this.status = category.status;
      this.products = category.products;
      this.imageBase64 = category.imageBase64;
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

export class oCoupon {
   code = "";
   type = 0;
   quantity = 0;
   expiryDate = new Date();

   constructor(coupon = {
      code: "",
      type: 0,
      quantity: 0,
      expiryDate: new Date(),
   }) {
      this.code = coupon.code;
      this.type = coupon.type;
      this.quantity = coupon.quantity;
      this.expiryDate = coupon.expiryDate;
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
   address = new oAddress();
   payment = new oPayment();
   coupon = new oCoupon();
   orderItems = [];

   constructor(order = {
      id: 0,
      date: new Date(),
      status: 0,
      totalPrice: 0,
      address: new oAddress(),
      payment: new oPayment(),
      coupon: new oCoupon(),
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
   order = new oOrder();
   product = new oProduct();
   comments = [];
   scores = [];

   constructor(orderItem = {
      id: 0,
      quantity: 0,
      order: new oOrder(),
      product: new oProduct(),
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
   imageBase64 = "";
   status = false;
   price = 0;
   unitQuantity = 0;
   unit = 0;
   category = new oCategory();
   storeItems = [];
   averageRate = 5;
   comments = [];

   constructor(product = {
      id: 0,
      name: "",
      description: "",
      imagePath: "",
      imageBase64: "",
      status: false,
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
      this.imageBase64 = product.imageBase64;
      this.status = product.status;
      this.price = product.price;
      this.unitQuantity = product.unitQuantity;
      this.unit = product.unit;
      this.category = new oCategory(product.category);
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

export class oStore {
   id = 0;
   name = " ";
   status = false;

   constructor(store = {
      id: 0,
      name: " ",
      status: false
   }) {
      this.id = store.id;
      this.name = store.name;
      this.status = store.status;
   }
}

export class oStoreItem {
   storeId = 0;
   productId = 0;
   quantity = 0;

   constructor(storageItem = {
      storeId: 0,
      productId: 0,
      quantity: 0,
   }) {
      this.storeId = storageItem.storeId;
      this.productId = storageItem.productId;
      this.quantity = storageItem.quantity;
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
   surname = "";
   registeredDate = new Date();
   role = new oRole();
   password = "";
   phoneNumber = "";
   email = "";
   addresses = [];
   subscribeNewsLetter = false;

   constructor(user = {
      id: 0,
      firstName: "",
      surname: "",
      registeredDate: new Date(),
      role: new oRole(),
      password: "",
      phoneNumber: "",
      email: "",
      addresses: [],
      subscribeNewsLetter: false,
   }) {
      this.id = user.id;
      this.firstName = user.firstName;
      this.surname = user.surname;
      this.registeredDate = user.registeredDate;
      this.role = new oRole(user.role);
      this.password = user.password;
      this.phoneNumber = user.phoneNumber;
      this.email = user.email;
      this.addresses = user.addresses;
      this.subscribeNewsLetter = user.subscribeNewsLetter;
   }
}