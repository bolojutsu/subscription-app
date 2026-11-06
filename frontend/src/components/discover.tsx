import { useState, useEffect } from "react";
import {api} from "../configs/api";
import type {Vendor} from "../configs/types";

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
            plan_name: "Standard",
            price_in_cents: 999,
        });
        setSubscribed((previous) => new Set(previous).add(vendor.vendor_id));
    };

    if (loading) return <p>Loading vendors...</p>;

    return (
        <section>
            <h1>Discover vendors</h1>
            {vendors.length === 0 && <p>No vendors yet.</p>}
            <ul>
                {vendors.map((v) => (
                    <li key={v.vendor_id}>
                        <h2>{v.business_name}</h2>
                        {v.description && <p>{v.description}</p>}
                        {v.website && <a href={v.website}>{v.website}</a>}
                        <button
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