import Stripe from 'stripe';

export type Customer = Stripe.Customer;

export type CheckoutSession = Stripe.Checkout.Session;

export type CheckoutSessionStatus = Stripe.Checkout.Session.Status;

export type Event = Stripe.Event;

export type EventType = Stripe.Event.Type;

export type CustomerSubscriptionCreatedEvent =
  Stripe.CustomerSubscriptionCreatedEvent;

export type CustomerSubscriptionUpdatedEvent =
  Stripe.CustomerSubscriptionUpdatedEvent;

export type CustomerSubscriptionDeletedEvent =
  Stripe.CustomerSubscriptionDeletedEvent;

export type ProductCreateEvent = Stripe.ProductCreatedEvent;

export type ProductUpdateEvent = Stripe.ProductUpdatedEvent;

export type ProductDeleteEvent = Stripe.ProductDeletedEvent;

export type PriceCreateEvent = Stripe.PriceCreatedEvent;

export type PriceUpdateEvent = Stripe.PriceUpdatedEvent;

export type PriceDeleteEvent = Stripe.PriceDeletedEvent;

export type Subscription = Stripe.Subscription;

export type SubscriptionItem = Stripe.SubscriptionItem;

export type SubscriptionStatus = Stripe.Subscription.Status;

export type Price = Stripe.Price;

export type Product = Stripe.Product;

export type BillingPortalSession = Stripe.BillingPortal.Session;

export type Invoice = Stripe.Invoice;

export type InvoiceStatus = Stripe.Invoice.Status;
