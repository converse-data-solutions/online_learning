class CreateSubscriptions < ActiveRecord::Migration[7.0]
  def change
    create_table :subscriptions do |t|
      t.datetime :paid_until
      t.string :stripe_customer_ref
      t.string :stripe_subscription_ref
      t.datetime :next_invoice_on
      t.references :user, null: false, foreign_key: true
      t.string :status

      t.timestamps
    end
  end
end
