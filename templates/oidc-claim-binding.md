# OIDC claim-binding draft

This is a non-deployable template. It authorizes no principal and contains no cloud identifier, role identifier, audience value, repository identifier, or environment value.

Before any cloud change, a separate approval package must bind all placeholders from a protected environment and verify:

- exact issuer equality;
- exact audience equality;
- exact subject equality for one repository and one protected environment;
- no wildcard subject, alternate principal, or fallback identity;
- role permissions remain unchanged;
- no token has been issued and no workload has run.

If any value or proof is unavailable, the trust change must not be applied.
