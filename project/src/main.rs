use std::io::{self, Write};
use crate::subscription::Subscription;
use crate::user::User;

mod subscription;
mod user;



fn prompt_input(prompt: &str) -> String {
    print!("{}", prompt);
    io::stdout().flush().unwrap();
    
    let mut input = String::new();
    io::stdin().read_line(&mut input).expect("Failed to read line");
    input.trim().to_string()
}
fn main() {
    println!("--- Create User ---");
    let user_id = prompt_input("Enter User id: ");
    let name = prompt_input("Enter name: ");

    let user = User {user_id, name};

    println!("\n --- Create Subscription ---");
    let subscription_id = prompt_input("Enter subscription Id: ");
    let plan_name = prompt_input("Enter Plan Name: ");

    let price_str = prompt_input("Enter price in cents (e.g., 999): ");
    let price_in_cents: u32 = price_str.parse().unwrap_or(0);

    let is_active_str = prompt_input("Is Active? (true/false): ");
    let is_active: bool = is_active_str.parse().unwrap_or(false);

    let subscription = Subscription {
        subscription_id,
        user_id: user.user_id.clone(),
        plan_name,
        price_in_cents,
        is_active,
    };

    println!("\n--- Successfully Created ---");
    println!("User: {} (ID: {})", user.name, user.user_id);
    println!(
        "Subscription: {} | Plan: {} | Price: ${:.2} | Active: {}",
        subscription.subscription_id,
        subscription.plan_name,
        subscription.price_in_cents as f64 / 100.0,
        subscription.is_active
    );
}
