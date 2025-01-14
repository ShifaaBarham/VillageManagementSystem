const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { GraphQLJSON } = require("graphql-type-json");
const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPasswordStrong = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const resolvers = {
  JSON: GraphQLJSON,

  // Queries
  Query: {
    admins: async (_, __, { db }) => {
      return await db.query("SELECT id, full_name, profile_image FROM users WHERE role = 'admin'");
    },
    userChats: async (_, { userId, recipientId }, { db }) => {
      return await db.query(
        "SELECT * FROM messages WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?) ORDER BY timestamp",
        [userId, recipientId, recipientId, userId]
      );
    },
    villages: async () => {
      const [rows] = await db.query("SELECT * FROM villages");
      return rows;
    },
    user: async (_, { id }, { db }) => {
      try {
        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        if (rows.length === 0) {
          throw new Error("User not found");
        }
        return rows[0];
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
      }
    },

    village: async (_, { id }) => {
      const [rows] = await db.query("SELECT * FROM villages WHERE id = ?", [id]);
      if (rows.length === 0) {
        throw new Error(`Village with ID ${id} not found`);
      }
      return rows[0];
    },
    getGallery: async (_, { userId }) => {
      const [adminImages] = await db.query(`
        SELECT g.* 
        FROM gallery g
        JOIN users u ON g.ownerId = u.id
        WHERE u.role = 'admin'
      `);
    
      const [userImages] = await db.query("SELECT * FROM gallery WHERE ownerId = ?", [userId]);
    
      const uniqueImages = new Map();

      [...adminImages, ...userImages].forEach((image) => {
        uniqueImages.set(image.id, image);
      });
    
      return Array.from(uniqueImages.values());    },
    

    currentUser: async (_, __, { token }) => {
      if (!token) throw new Error("Not authenticated");
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [user] = await db.query(
          "SELECT id, username, full_name, role FROM users WHERE id = ?",
          [decoded.id]
        );
        return user;
      } catch (err) {
        throw new Error("Invalid token");
      }
    },
  },

  // Mutations
  Mutation: {

    addVillage: async (_, args) => {
      try {
        const tagsValue = Array.isArray(args.tags) ? JSON.stringify(args.tags) : args.tags;
  
        const sql = `
          INSERT INTO villages 
          (name, region, land_area, latitude, longitude, image, tags) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [
          args.name,
          args.region,
          args.land_area,
          args.latitude,
          args.longitude,
          args.image || null,
          tagsValue,
        ]);
  
        return {
          id: result.insertId,
          ...args,
          tags: Array.isArray(args.tags) ? args.tags : JSON.parse(args.tags || "[]"),
        };
      } catch (err) {
        console.error("Error in addVillage:", err);
        throw new Error("Failed to add village");
      }
    },
    updateUser: async (_, { id, username, password, profile_image }, { db }) => {
      try {
        const updatedFields = {};
        if (username) updatedFields.username = username;
        if (password) updatedFields.password = await bcrypt.hash(password, 10);
        if (profile_image) updatedFields.profile_image = profile_image;
    
        const query = "UPDATE users SET ? WHERE id = ?";
        await db.query(query, [updatedFields, id]);
    
        return { id, username, profile_image };
      } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
      }
    },
    
    addDemographicData: async (
      _,
      { villageId, population, population_distribution, gender_ratios, population_growth_rate }
    ) => {
      try {
        const populationDistributionJson = typeof population_distribution === "string"
          ? JSON.parse(population_distribution)
          : population_distribution;
    
        const genderRatiosJson = typeof gender_ratios === "string"
          ? JSON.parse(gender_ratios)
          : gender_ratios;
    
        const sql = `
          UPDATE villages 
          SET 
            population = ?, 
            population_distribution = ?, 
            gender_ratios = ?, 
            population_growth_rate = ? 
          WHERE id = ?
        `;
        await db.query(sql, [
          population,
          JSON.stringify(populationDistributionJson),
          JSON.stringify(genderRatiosJson),
          population_growth_rate,
          villageId,
        ]);
    
        const [updatedVillage] = await db.query(
          "SELECT * FROM villages WHERE id = ?",
          [villageId]
        );
        return updatedVillage[0];
      } catch (error) {
        console.error("Error in addDemographicData:", error);
        throw new Error("Failed to add demographic data");
      }
    },
    
    
   updateVillage: async (_, args) => {
  // إنشاء الحقول ديناميكيًا بناءً على المدخلات
  const fields = [];
  const values = [];

  if (args.name !== undefined) {
    fields.push("name = ?");
    values.push(args.name);
  }
  if (args.region !== undefined) {
    fields.push("region = ?");
    values.push(args.region);
  }
  if (args.land_area !== undefined) {
    fields.push("land_area = ?");
    values.push(args.land_area);
  }
  if (args.latitude !== undefined) {
    fields.push("latitude = ?");
    values.push(args.latitude);
  }
  if (args.longitude !== undefined) {
    fields.push("longitude = ?");
    values.push(args.longitude);
  }
  if (args.image !== undefined) {
    fields.push("image = ?");
    values.push(args.image || null);
  }

  // إذا لم يتم إرسال أي حقول للتحديث، إرجاع خطأ
  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  // إضافة معرف القرية إلى القيم
  values.push(args.id);

  // إنشاء استعلام SQL ديناميكي
  const sql = `
    UPDATE villages 
    SET ${fields.join(", ")}
    WHERE id = ?
  `;

  await db.query(sql, values);
  return args;
},


    deleteVillage: async (_, { id }) => {
      await db.query("DELETE FROM villages WHERE id = ?", [id]);
      return true;
    },


    signUp: async (_, { username, password, full_name, role, profileImage = null }) => {
      if (!isEmailValid(username)) {
        throw new Error("Invalid email format.");
      }
    
      if (!isPasswordStrong(password)) {
        throw new Error("Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.");
      }
    
      const [existingUser] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
      if (existingUser.length > 0) {
        throw new Error("Username already exists.");
      }
    
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = `
        INSERT INTO users (username, password, full_name, role${profileImage ? ", profileImage" : ""}) 
        VALUES (?, ?, ?, ?${profileImage ? ", ?" : ""})
      `;
      const params = profileImage
        ? [username, hashedPassword, full_name, role, profileImage]
        : [username, hashedPassword, full_name, role];
    
      await db.query(sql, params);
    
      const token = jwt.sign({ username, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
      return { token, role, username };
    },
    

    login: async (_, { username, password }) => {
      const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
      if (rows.length === 0) {
        throw new Error("User not found");
      }

      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid username or password");
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return { token, role: user.role, username: user.username };
    },

    logout: async (_, __, { token }) => {
      if (!token) throw new Error("Not authenticated");
    
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const [user] = await db.query("SELECT * FROM users WHERE id = ?", [decoded.id]);
        if (!user.length) {
          throw new Error("User not found.");
        }
    
        await db.query("UPDATE users SET is_logged_in = 0 WHERE id = ?", [decoded.id]);
        return { message: "Logged out successfully" };
      } catch (err) {
        throw new Error("Invalid token");
      }
    },
    

    addImage: async (_, { imgBase64, imgText, ownerId }) => {
      const sql = "INSERT INTO gallery (imgBase64, imgText, ownerId) VALUES (?, ?, ?)";
      const [result] = await db.query(sql, [imgBase64, imgText, ownerId]);
      return {
        id: result.insertId,
        imgBase64,
        imgText,
        ownerId,
        createdAt: new Date().toISOString(),
      };
    },
    
  },
};

module.exports = resolvers;
