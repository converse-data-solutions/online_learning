json.extract! subscription, :id, :paid_until, :stripe_customer_ref, :stripe_subscription_ref, :next_invoice_on, :user_id, :status, :created_at, :updated_at
json.url subscription_url(subscription, format: :json)
