CREATE VIEW grower_account AS
  SELECT grower_account.*
  FROM treetracker.grower_account grower_account
  LEFT JOIN messaging.author author
  ON author.handle = grower_account.wallet
  LEFT JOIN stakeholder.stakeholder stakeholder
  ON stakeholder.id = grower_account.organization_id;

