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

    getGallery: async () => {
      const [rows] = await db.query("SELECT * FROM gallery");
      return rows;
    },

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
        // تحويل tags إلى JSON إذا كانت مصفوفة
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
          JSON.stringify(population_distribution), // تحويل التوزيع إلى نص JSON
          JSON.stringify(gender_ratios),          // تحويل النسب إلى نص JSON
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
      const sql = `
        UPDATE villages 
        SET 
          name = ?, region = ?, land_area = ?, latitude = ?, longitude = ?, 
          image = ?, tags = ?, population = ?, 
          population_distribution = ?, gender_ratios = ?, 
          population_growth_rate = ? 
        WHERE id = ?
      `;
      await db.query(sql, [
        args.name,
        args.region,
        args.land_area,
        args.latitude,
        args.longitude,
        args.image,
        JSON.stringify(args.tags),
        args.population,
        JSON.stringify(args.population_distribution),
        JSON.stringify(args.gender_ratios),
        args.population_growth_rate,
        args.id,
      ]);
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
    

    addImage: async (_, { imgBase64, imgText }) => {
      const sql = "INSERT INTO gallery (imgBase64, imgText) VALUES (?, ?)";
      const [result] = await db.query(sql, [imgBase64, imgText]);
      return {
        id: result.insertId,
        imgBase64,
        imgText,
        createdAt: new Date().toISOString(),
      };
    },
  },
};

module.exports = resolvers;
