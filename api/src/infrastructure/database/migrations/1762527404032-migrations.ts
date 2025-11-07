import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1762527404032 implements MigrationInterface {
    name = 'Migrations1762527404032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "comment" ("id" SERIAL NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, "postId" integer, "parentId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "like" ("id" SERIAL NOT NULL, "userId" integer, "postId" integer, CONSTRAINT "UQ_78a9f4a1b09b6d2bf7ed85f252f" UNIQUE ("userId", "postId"), CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "post" ("id" SERIAL NOT NULL, "content" text NOT NULL, "medias" text array, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "chats" ("id" SERIAL NOT NULL, "receiverId" integer NOT NULL, "senderId" integer NOT NULL, "isGroup" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "messages" ("id" SERIAL NOT NULL, "chatId" integer NOT NULL, "senderId" integer NOT NULL, "content" character varying NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "room_categories" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "slug" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ef520f244ee34141bd897de8009" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "room_messages" ("id" SERIAL NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "roomId" integer, "senderId" integer, CONSTRAINT "PK_bd83c95b3d0ad3931d6c1687ee1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "rooms" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'public', "duration" integer NOT NULL DEFAULT '0', "fee" integer NOT NULL DEFAULT '0', "description" text, "photo" text, "status" character varying NOT NULL DEFAULT 'active', "allow_send_message" boolean NOT NULL DEFAULT true, "allow_voice_note" boolean NOT NULL DEFAULT true, "anonymous_mode" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "roomCategoryId" integer, "ownerId" integer NOT NULL, CONSTRAINT "UQ_368d83b661b9670e7be1bbb9cdd" UNIQUE ("code"), CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "room_members" ("id" SERIAL NOT NULL, "role" character varying NOT NULL DEFAULT 'member', "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "roomId" integer, "userId" integer, CONSTRAINT "UQ_151cb61c3e462093aa3b8e70f7b" UNIQUE ("userId", "roomId"), CONSTRAINT "PK_4493fab0433f741b7cf842e6038" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "photo" character varying, "email" character varying, "address" character varying, "xp" integer NOT NULL DEFAULT '0', "title" character varying, "about" text, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "wallet" ("id" SERIAL NOT NULL, "celo_address" character varying, "celo_balance" numeric(36,18) NOT NULL DEFAULT '0', "base_address" character varying, "base_balance" numeric(36,18) NOT NULL DEFAULT '0', "starknet_address" character varying, "starknet_balance" numeric(36,18) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_35472b1fe48b6330cd34970956" UNIQUE ("userId"), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "user_followers" ("followed_id" integer NOT NULL, "follower_id" integer NOT NULL, CONSTRAINT "PK_c733ce9c1112a47c0229fc635a1" PRIMARY KEY ("followed_id", "follower_id"))`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_dd55081e5fce6a4f6e1f40ccaf" ON "user_followers" ("followed_id") `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_da722d93356ae3119d6be40d98" ON "user_followers" ("follower_id") `);
        
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_276779da446413a0d79598d4fbd') THEN ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_94a85bb16d24033a2afdd5df060') THEN ALTER TABLE "comment" ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_e3aebe2bd1c53467a07109be596') THEN ALTER TABLE "comment" ADD CONSTRAINT "FK_e3aebe2bd1c53467a07109be596" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_e8fb739f08d47955a39850fac23') THEN ALTER TABLE "like" ADD CONSTRAINT "FK_e8fb739f08d47955a39850fac23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_3acf7c55c319c4000e8056c1279') THEN ALTER TABLE "like" ADD CONSTRAINT "FK_3acf7c55c319c4000e8056c1279" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_c6fb082a3114f35d0cc27c518e0') THEN ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_c8562e07e5260b76b37e25126c6') THEN ALTER TABLE "chats" ADD CONSTRAINT "FK_c8562e07e5260b76b37e25126c6" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_d697f19c9c7778ed773b449ce70') THEN ALTER TABLE "chats" ADD CONSTRAINT "FK_d697f19c9c7778ed773b449ce70" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_36bc604c820bb9adc4c75cd4115') THEN ALTER TABLE "messages" ADD CONSTRAINT "FK_36bc604c820bb9adc4c75cd4115" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_2db9cf2b3ca111742793f6c37ce') THEN ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_ed2fc7e191c5d281b9393ded5f0') THEN ALTER TABLE "room_messages" ADD CONSTRAINT "FK_ed2fc7e191c5d281b9393ded5f0" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_aaf8cc02bd14a8a2c81c043494f') THEN ALTER TABLE "room_messages" ADD CONSTRAINT "FK_aaf8cc02bd14a8a2c81c043494f" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_4a7ac5d5682fdc411d7756c8b46') THEN ALTER TABLE "rooms" ADD CONSTRAINT "FK_4a7ac5d5682fdc411d7756c8b46" FOREIGN KEY ("roomCategoryId") REFERENCES "room_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_383ac461c63dd52c22ba73a6624') THEN ALTER TABLE "rooms" ADD CONSTRAINT "FK_383ac461c63dd52c22ba73a6624" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_a27f901523ddfa2eaecb16a5976') THEN ALTER TABLE "room_members" ADD CONSTRAINT "FK_a27f901523ddfa2eaecb16a5976" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_ca3c84760fb37c2f14658a0a2ec') THEN ALTER TABLE "room_members" ADD CONSTRAINT "FK_ca3c84760fb37c2f14658a0a2ec" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_35472b1fe48b6330cd349709564') THEN ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_dd55081e5fce6a4f6e1f40ccaf0') THEN ALTER TABLE "user_followers" ADD CONSTRAINT "FK_dd55081e5fce6a4f6e1f40ccaf0" FOREIGN KEY ("followed_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;`);
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_da722d93356ae3119d6be40d988') THEN ALTER TABLE "user_followers" ADD CONSTRAINT "FK_da722d93356ae3119d6be40d988" FOREIGN KEY ("follower_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION; END IF; END $$;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_followers" DROP CONSTRAINT IF EXISTS "FK_da722d93356ae3119d6be40d988"`);
        await queryRunner.query(`ALTER TABLE "user_followers" DROP CONSTRAINT IF EXISTS "FK_dd55081e5fce6a4f6e1f40ccaf0"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT IF EXISTS "FK_35472b1fe48b6330cd349709564"`);
        await queryRunner.query(`ALTER TABLE "room_members" DROP CONSTRAINT IF EXISTS "FK_ca3c84760fb37c2f14658a0a2ec"`);
        await queryRunner.query(`ALTER TABLE "room_members" DROP CONSTRAINT IF EXISTS "FK_a27f901523ddfa2eaecb16a5976"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT IF EXISTS "FK_383ac461c63dd52c22ba73a6624"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT IF EXISTS "FK_4a7ac5d5682fdc411d7756c8b46"`);
        await queryRunner.query(`ALTER TABLE "room_messages" DROP CONSTRAINT IF EXISTS "FK_aaf8cc02bd14a8a2c81c043494f"`);
        await queryRunner.query(`ALTER TABLE "room_messages" DROP CONSTRAINT IF EXISTS "FK_ed2fc7e191c5d281b9393ded5f0"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_2db9cf2b3ca111742793f6c37ce"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_36bc604c820bb9adc4c75cd4115"`);
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT IF EXISTS "FK_d697f19c9c7778ed773b449ce70"`);
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT IF EXISTS "FK_c8562e07e5260b76b37e25126c6"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT IF EXISTS "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT IF EXISTS "FK_3acf7c55c319c4000e8056c1279"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT IF EXISTS "FK_e8fb739f08d47955a39850fac23"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT IF EXISTS "FK_e3aebe2bd1c53467a07109be596"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT IF EXISTS "FK_94a85bb16d24033a2afdd5df060"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT IF EXISTS "FK_276779da446413a0d79598d4fbd"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_da722d93356ae3119d6be40d98"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_dd55081e5fce6a4f6e1f40ccaf"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user_followers"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "wallet"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "room_members"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "rooms"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "room_messages"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "room_categories"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "messages"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "chats"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "post"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "like"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "comment"`);
    }

}
