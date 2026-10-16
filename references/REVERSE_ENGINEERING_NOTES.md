# Reverse-engineering notes

The source page is a long-form conversion experience for a managed AI receptionist product. Its strongest structural pattern is a repeated transformation: an unstructured business problem becomes a visible interface state, then a captured record, then a business action.

Observed sections include a sticky header; hero call scene; call-to-portal dashboard; operator business-model statement; six-step prospect-to-live workflow; architecture, memory, and continuity cards; profit calculator; six-stage system flow; proof section; pricing; comparison; FAQ; closing CTA; and footer.

Observed visual tokens include a warm cream surface, near-black product panels, gold accent, muted ink, hairline borders, rounded cards, compact uppercase labels, serif display emphasis, and monospace status metadata.

Observed interactions include anchor navigation, a responsive mobile menu, a workflow state switcher, two range inputs, plan tabs, monthly/annual billing controls, an expandable comparison area, and native FAQ disclosure elements.

This repository implements the visible product behavior locally, but it does not claim to implement real telephony, AI inference, public business data, billing, authentication, or persistence. Add those as explicit backend integrations rather than quietly replacing the mock states.
