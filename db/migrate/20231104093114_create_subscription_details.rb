class CreateSubscriptionDetails < ActiveRecord::Migration[7.0]
  def change
    create_table :subscription_details do |t|
      t.references :user, null: false, foreign_key: true
      t.references :subscription, null: false, foreign_key: true
      t.string :stripe_subscription_id
      t.integer :amount
      t.datetime :paid_at
      t.datetime :start_date
      t.datetime :end_date

      t.timestamps
    end
  end
end
