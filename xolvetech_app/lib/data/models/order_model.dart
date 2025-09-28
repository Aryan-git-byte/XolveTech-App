// lib/data/models/order_model.dart
import 'package:cloud_firestore/cloud_firestore.dart';

enum OrderStatus {
  pending,
  confirmed,
  processing,
  shipped,
  delivered,
  cancelled,
  refunded
}

enum PaymentStatus {
  pending,
  completed,
  failed,
  refunded
}

class OrderModel {
  final String id;
  final String userId;
  final List<OrderItemModel> items;
  final double subtotal;
  final double shippingCost;
  final double tax;
  final double discount;
  final double total;
  final OrderStatus status;
  final PaymentStatus paymentStatus;
  final String paymentMethod;
  final String? paymentId;
  final ShippingAddressModel shippingAddress;
  final String? trackingNumber;
  final DateTime? estimatedDelivery;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<OrderStatusUpdateModel> statusHistory;
  
  OrderModel({
    required this.id,
    required this.userId,
    required this.items,
    required this.subtotal,
    required this.shippingCost,
    required this.tax,
    required this.discount,
    required this.total,
    required this.status,
    required this.paymentStatus,
    required this.paymentMethod,
    this.paymentId,
    required this.shippingAddress,
    this.trackingNumber,
    this.estimatedDelivery,
    required this.createdAt,
    required this.updatedAt,
    required this.statusHistory,
  });
  
  factory OrderModel.fromMap(Map<String, dynamic> map) {
    return OrderModel(
      id: map['id'] ?? '',
      userId: map['userId'] ?? '',
      items: (map['items'] as List<dynamic>?)
              ?.map((item) => OrderItemModel.fromMap(item as Map<String, dynamic>))
              .toList() ?? [],
      subtotal: (map['subtotal'] ?? 0).toDouble(),
      shippingCost: (map['shippingCost'] ?? 0).toDouble(),
      tax: (map['tax'] ?? 0).toDouble(),
      discount: (map['discount'] ?? 0).toDouble(),
      total: (map['total'] ?? 0).toDouble(),
      status: OrderStatus.values.firstWhere(
        (e) => e.name == map['status'],
        orElse: () => OrderStatus.pending,
      ),
      paymentStatus: PaymentStatus.values.firstWhere(
        (e) => e.name == map['paymentStatus'],
        orElse: () => PaymentStatus.pending,
      ),
      paymentMethod: map['paymentMethod'] ?? '',
      paymentId: map['paymentId'],
      shippingAddress: ShippingAddressModel.fromMap(map['shippingAddress'] ?? {}),
      trackingNumber: map['trackingNumber'],
      estimatedDelivery: map['estimatedDelivery'] != null 
          ? (map['estimatedDelivery'] as Timestamp).toDate()
          : null,
      createdAt: (map['createdAt'] as Timestamp).toDate(),
      updatedAt: (map['updatedAt'] as Timestamp).toDate(),
      statusHistory: (map['statusHistory'] as List<dynamic>?)
              ?.map((status) => OrderStatusUpdateModel.fromMap(status as Map<String, dynamic>))
              .toList() ?? [],
    );
  }
  
  factory OrderModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    data['id'] = doc.id;
    return OrderModel.fromMap(data);
  }
  
  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'items': items.map((item) => item.toMap()).toList(),
      'subtotal': subtotal,
      'shippingCost': shippingCost,
      'tax': tax,
      'discount': discount,
      'total': total,
      'status': status.name,
      'paymentStatus': paymentStatus.name,
      'paymentMethod': paymentMethod,
      'paymentId': paymentId,
      'shippingAddress': shippingAddress.toMap(),
      'trackingNumber': trackingNumber,
      'estimatedDelivery': estimatedDelivery != null 
          ? Timestamp.fromDate(estimatedDelivery!)
          : null,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': Timestamp.fromDate(updatedAt),
      'statusHistory': statusHistory.map((status) => status.toMap()).toList(),
    };
  }
  
  String get statusText {
    switch (status) {
      case OrderStatus.pending:
        return 'Pending';
      case OrderStatus.confirmed:
        return 'Confirmed';
      case OrderStatus.processing:
        return 'Processing';
      case OrderStatus.shipped:
        return 'Shipped';
      case OrderStatus.delivered:
        return 'Delivered';
      case OrderStatus.cancelled:
        return 'Cancelled';
      case OrderStatus.refunded:
        return 'Refunded';
    }
  }
  
  String get paymentStatusText {
    switch (paymentStatus) {
      case PaymentStatus.pending:
        return 'Pending';
      case PaymentStatus.completed:
        return 'Completed';
      case PaymentStatus.failed:
        return 'Failed';
      case PaymentStatus.refunded:
        return 'Refunded';
    }
  }
  
  bool get canCancel => status == OrderStatus.pending || status == OrderStatus.confirmed;
  bool get isDelivered => status == OrderStatus.delivered;
  bool get canTrack => trackingNumber != null && (status == OrderStatus.shipped || status == OrderStatus.delivered);
}

class OrderItemModel {
  final String kitId;
  final String kitName;
  final String kitImageUrl;
  final double unitPrice;
  final int quantity;
  final double totalPrice;
  
  OrderItemModel({
    required this.kitId,
    required this.kitName,
    required this.kitImageUrl,
    required this.unitPrice,
    required this.quantity,
    required this.totalPrice,
  });
  
  factory OrderItemModel.fromMap(Map<String, dynamic> map) {
    return OrderItemModel(
      kitId: map['kitId'] ?? '',
      kitName: map['kitName'] ?? '',
      kitImageUrl: map['kitImageUrl'] ?? '',
      unitPrice: (map['unitPrice'] ?? 0).toDouble(),
      quantity: map['quantity'] ?? 1,
      totalPrice: (map['totalPrice'] ?? 0).toDouble(),
    );
  }
  
  Map<String, dynamic> toMap() {
    return {
      'kitId': kitId,
      'kitName': kitName,
      'kitImageUrl': kitImageUrl,
      'unitPrice': unitPrice,
      'quantity': quantity,
      'totalPrice': totalPrice,
    };
  }
}

class ShippingAddressModel {
  final String fullName;
  final String addressLine1;
  final String? addressLine2;
  final String city;
  final String state;
  final String postalCode;
  final String country;
  final String phoneNumber;
  
  ShippingAddressModel({
    required this.fullName,
    required this.addressLine1,
    this.addressLine2,
    required this.city,
    required this.state,
    required this.postalCode,
    required this.country,
    required this.phoneNumber,
  });
  
  factory ShippingAddressModel.fromMap(Map<String, dynamic> map) {
    return ShippingAddressModel(
      fullName: map['fullName'] ?? '',
      addressLine1: map['addressLine1'] ?? '',
      addressLine2: map['addressLine2'],
      city: map['city'] ?? '',
      state: map['state'] ?? '',
      postalCode: map['postalCode'] ?? '',
      country: map['country'] ?? 'India',
      phoneNumber: map['phoneNumber'] ?? '',
    );
  }
  
  Map<String, dynamic> toMap() {
    return {
      'fullName': fullName,
      'addressLine1': addressLine1,
      'addressLine2': addressLine2,
      'city': city,
      'state': state,
      'postalCode': postalCode,
      'country': country,
      'phoneNumber': phoneNumber,
    };
  }
  
  String get formattedAddress {
    String address = addressLine1;
    if (addressLine2?.isNotEmpty == true) {
      address += ', $addressLine2';
    }
    address += ', $city, $state $postalCode, $country';
    return address;
  }
}

class OrderStatusUpdateModel {
  final OrderStatus status;
  final String? note;
  final DateTime timestamp;
  
  OrderStatusUpdateModel({
    required this.status,
    this.note,
    required this.timestamp,
  });
  
  factory OrderStatusUpdateModel.fromMap(Map<String, dynamic> map) {
    return OrderStatusUpdateModel(
      status: OrderStatus.values.firstWhere(
        (e) => e.name == map['status'],
        orElse: () => OrderStatus.pending,
      ),
      note: map['note'],
      timestamp: (map['timestamp'] as Timestamp).toDate(),
    );
  }
  
  Map<String, dynamic> toMap() {
    return {
      'status': status.name,
      'note': note,
      'timestamp': Timestamp.fromDate(timestamp),
    };
  }
}