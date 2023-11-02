require "application_system_test_case"

class SubscriptionsTest < ApplicationSystemTestCase
  setup do
    @subscription = subscriptions(:one)
  end

  test "visiting the index" do
    visit subscriptions_url
    assert_selector "h1", text: "Subscriptions"
  end

  test "should create subscription" do
    visit subscriptions_url
    click_on "New subscription"

    fill_in "Amount paid", with: @subscription.amount_paid
    fill_in "Next due", with: @subscription.next_due
    fill_in "Paid at", with: @subscription.paid_at
    fill_in "Status", with: @subscription.status
    fill_in "Stripe subscription", with: @subscription.stripe_subscription_id
    fill_in "Subscription type", with: @subscription.subscription_type
    fill_in "User", with: @subscription.user_id
    click_on "Create Subscription"

    assert_text "Subscription was successfully created"
    click_on "Back"
  end

  test "should update Subscription" do
    visit subscription_url(@subscription)
    click_on "Edit this subscription", match: :first

    fill_in "Amount paid", with: @subscription.amount_paid
    fill_in "Next due", with: @subscription.next_due
    fill_in "Paid at", with: @subscription.paid_at
    fill_in "Status", with: @subscription.status
    fill_in "Stripe subscription", with: @subscription.stripe_subscription_id
    fill_in "Subscription type", with: @subscription.subscription_type
    fill_in "User", with: @subscription.user_id
    click_on "Update Subscription"

    assert_text "Subscription was successfully updated"
    click_on "Back"
  end

  test "should destroy Subscription" do
    visit subscription_url(@subscription)
    click_on "Destroy this subscription", match: :first

    assert_text "Subscription was successfully destroyed"
  end
end
