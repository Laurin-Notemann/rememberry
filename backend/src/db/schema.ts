import { relations } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  date,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  confirmed: boolean("confirmed").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const session = pgTable("session", {
  id: varchar("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const userSessionRelation = relations(users, ({ many }) => ({
  maps: many(session),
}));

export const userRelations = relations(users, ({ many }) => ({
  maps: many(maps),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const maps = pgTable("maps", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  peerId: uuid("peer_id").references(() => peers.id),
  name: varchar("name").notNull(),
  description: varchar("description").default("").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const mapRelations = relations(maps, ({ one, many }) => ({
  users: one(users, {
    fields: [maps.userId],
    references: [users.id],
  }),
  peers: one(peers, {
    fields: [maps.peerId],
    references: [peers.id],
  }),
  nodes: many(nodes),
}));

export type Map = typeof maps.$inferSelect;
export type newMap = typeof maps.$inferInsert;

export const nodeType = pgEnum("node_type", ["stack", "flashcard"]);

export type NodeType = typeof nodeType.enumValues;

export const nodes = pgTable("nodes", {
  id: uuid("id").defaultRandom().primaryKey(),
  mapId: uuid("map_id")
    .references(() => maps.id, { onDelete: "cascade" })
    .notNull(),
  frontside: varchar("frontside").notNull(),
  backside: varchar("backside").notNull(),
  xPosition: doublePrecision("x_position").notNull(),
  yPosition: doublePrecision("y_position").notNull(),
  parentNodeId: uuid("parent_node_id").references((): AnyPgColumn => nodes.id),
  nodeType: nodeType("node_type").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const nodesRelations = relations(nodes, ({ one, many }) => ({
  maps: one(maps, {
    fields: [nodes.mapId],
    references: [maps.id],
  }),
  nodes: many(nodes),
  media: many(media),
  learningData: many(learningData),
}));

export type Node = typeof nodes.$inferSelect;
export type NewNode = typeof nodes.$inferInsert;

export const learningData = pgTable("learning_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  nodeId: uuid("node_id").references(() => nodes.id, {
    onDelete: "cascade",
  }),
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  timesLearned: integer("times_learned"),
  lastLearned: date("last_learned"),
  learningStatus: integer("learning_status").default(0),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const session_data_relations = relations(learningData, ({ one }) => ({
  flashcards: one(nodes, {
    fields: [learningData.nodeId],
    references: [nodes.id],
  }),
  users: one(users, {
    fields: [learningData.userId],
    references: [users.id],
  }),
}));

export type LearningData = typeof learningData.$inferSelect;
export type NewLearningData = typeof learningData.$inferInsert;

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  flashcardId: uuid("flashcard_id").references(() => nodes.id, {
    onDelete: "cascade",
  }),
  frontsideMediaLink: varchar("frontside_media_link"),
  frontsideMediaPositioning: varchar("frontside_media_positioning"),
  backsideMediaLink: varchar("backside_media_link"),
  backsideMediaPositioning: varchar("backside_media_positioning"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const media_relations = relations(media, ({ one }) => ({
  flashcards: one(nodes, {
    fields: [media.flashcardId],
    references: [nodes.id],
  }),
}));

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;

export const peers = pgTable("peers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const peersRelations = relations(peers, ({ many }) => ({
  usersPeers: many(usersPeers),
  maps: many(maps),
  invites: many(invites),
}));

export type Peer = typeof peers.$inferSelect;
export type NewPeer = typeof peers.$inferInsert;

export const usersPeers = pgTable("users_peers", {
  userId: uuid("user_id").references(() => users.id),
  peerId: uuid("peer_id").references(() => peers.id),
  isPeerAdmin: boolean("is_peer_admin").default(false).notNull(),
});

export const users_peers_relations = relations(usersPeers, ({ one }) => ({
  users: one(users, {
    fields: [usersPeers.userId],
    references: [users.id],
  }),
  Peers: one(peers, {
    fields: [usersPeers.peerId],
    references: [peers.id],
  }),
}));

export type UsersPeers = typeof usersPeers.$inferSelect;
export type NewUsersPeers = typeof usersPeers.$inferInsert;

export const invites = pgTable("invites", {
  id: uuid("id").defaultRandom(),
  receiverId: uuid("reveiver_id").references(() => users.id),
  senderId: uuid("sender_id").references(() => users.id),
  peerId: uuid("peer_id").references(() => peers.id),
  text: varchar("text"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const invitesRelations = relations(invites, ({ one }) => ({
  users: one(users),
  peers: one(peers),
}));

export type Invite = typeof invites.$inferSelect;
export type NewInvite = typeof invites.$inferInsert;
