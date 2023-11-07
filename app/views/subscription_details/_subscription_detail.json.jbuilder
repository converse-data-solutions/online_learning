json.extract! subscription_detail, :id, :user_id, :subscription_id, :stripe_subscription_id, :amount, :paid_at, :start_date, :end_date, :created_at, :updated_at
json.url subscription_detail_url(subscription_detail, format: :json)
