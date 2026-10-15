# Independent review checklist

An independent reviewer must confirm:

1. The change contains no sensitive or operational identifiers.
2. The contract fails closed for unknown or missing proof.
3. No executable workflow, cloud trust, credential, or token path is introduced.
4. The PR is reviewed after its latest commit.
5. The repository protection gate, not an administrator exception, controls integration.

A review approval establishes source-governance evidence only. It does not authorize cloud configuration, auditing, execution, or external API use.
