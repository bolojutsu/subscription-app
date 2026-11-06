import { useState, useEffect } from "react";
import {api} from "../configs/api";
import type {Vendor} from "../configs/types";
 // adjust the path to wherever you keep your stylesheets

const PLAN_NAME = "Standard";
const PLAN_PRICE_IN_CENTS = 999;

function Discover({customerId}: {customerId: string}) {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [subscribed, setSubscribed] = useState<Set<string>>(new Set());

    useEffect(() => {
        api.listVendors().then(setVendors).finally(() => setLoading(false));
    }, []);

    const subscribe = async (vendor: Vendor) => {
        await api.createSubscription({
            user_id: customerId,
            vendor_id: vendor.vendor_id,
            plan_name: PLAN_NAME,
            price_in_cents: PLAN_PRICE_IN_CENTS,
        });
        setSubscribed((previous) => new Set(previous).add(vendor.vendor_id));
    };

    if (loading) {
        return (
            <section className="discover">
                <p className="discover__status">Loading vendors...</p>
            </section>
        );
    }

    return (
        <section className="discover">
            <h1 className="discover__heading">Discover vendors</h1>
            {vendors.length === 0 && <p className="discover__status">No vendors yet.</p>}
            <ul className="discover__list">
                {vendors.map((v) => (
                    <li key={v.vendor_id} className="discover__card">
                        <span className="discover__avatar" aria-hidden="true">
                            {v.business_name.charAt(0).toUpperCase()}
                        </span>
                        <h2 className="discover__name">{v.business_name}</h2>
                        {v.description && <p className="discover__description">{v.description}</p>}
                        {v.website && (
                            <a className="discover__website" href={v.website}>
                                {v.website.replace(/^https?:\/\//, "")}
                            </a>
                        )}
                        <p className="discover__plan">
                            {PLAN_NAME} plan · ${(PLAN_PRICE_IN_CENTS / 100).toFixed(2)}/mo
                        </p>
                        <button
                            className="discover__subscribe"
                            onClick={() => subscribe(v)}
                            disabled={subscribed.has(v.vendor_id)}
                        >
                            {subscribed.has(v.vendor_id) ? "Subscribed" : "Subscribe"}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Discover