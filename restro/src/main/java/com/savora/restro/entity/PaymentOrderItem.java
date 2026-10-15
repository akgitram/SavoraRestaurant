
package com.savora.restro.entity;   

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "payment_order_items")
public class PaymentOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payment_order_id", nullable = false)
    private PaymentOrder order;

    @Column(nullable = false)
    private Long menuItemId;

    @Column(nullable = false)
    private String itemName;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    public void setOrder(PaymentOrder value) {
        order = value;
    }

    public void setMenuItemId(Long value) {
        menuItemId = value;
    }

    public void setItemName(String value) {
        itemName = value;
    }

    public void setQuantity(Integer value) {
        quantity = value;
    }

    public void setUnitPrice(BigDecimal value) {
        unitPrice = value;
    }

    public Long getId() {
        return id;
    }

    public Long getMenuItemId() {
        return menuItemId;
    }

    public String getItemName() {
        return itemName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }
}
