json.extract! subscription, :id, :user_id, :status, :subscription_type, :amount_paid, :paid_at, :next_due, :stripe_subscription_id, :created_at, :updated_at
json.url subscription_url(subscription, format: :json)
