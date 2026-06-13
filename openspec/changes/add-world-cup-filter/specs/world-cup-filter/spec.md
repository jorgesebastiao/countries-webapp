# Spec: world-cup-filter

## ADDED Requirements

### Requirement: Filter countries by World Cup edition
The home page SHALL offer a "World Cup" filter (Material select) listing every edition from the catalog, ordered most recent first, each labeled with its year and host(s). Selecting an edition SHALL restrict the country list to the countries that participated in that edition.

#### Scenario: Filter by the first edition
- **WHEN** the user selects the 1930 edition
- **THEN** the list shows only the 13 participating countries of the 1930 World Cup

#### Scenario: No edition selected
- **WHEN** no World Cup edition is selected
- **THEN** the country list behaves exactly as before this change (all countries, subject to the other filters)

### Requirement: World Cup filter composes with existing filters
The World Cup filter SHALL combine conjunctively (AND) with the existing name search and region filter. Clearing filters SHALL also reset the World Cup selection.

#### Scenario: Edition combined with region
- **WHEN** the user selects the 2022 edition and the region "Europe"
- **THEN** the list shows only European countries that participated in the 2022 World Cup

#### Scenario: Clearing the filters resets the edition
- **WHEN** the user activates the existing clear-filter action
- **THEN** the World Cup selection is cleared and the list no longer filters by edition

### Requirement: Host and champion highlighting
When an edition is selected, the country cards of that edition's host(s) and champion SHALL display distinguishing badges. The champion badge SHALL only appear for editions with a decided champion. A country that is both host and champion SHALL display both distinctions. No badges SHALL appear when no edition is selected.

#### Scenario: Champion is highlighted
- **WHEN** the user selects the 2022 edition
- **THEN** the Argentina card displays a champion badge and the Qatar card displays a host badge

#### Scenario: Host and champion combined
- **WHEN** the user selects the 1930 edition
- **THEN** the Uruguay card displays both the host and the champion distinctions

#### Scenario: Edition still in progress
- **WHEN** the user selects the 2026 edition
- **THEN** the United States, Mexico and Canada cards display host badges and no card displays a champion badge
