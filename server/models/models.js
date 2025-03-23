import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Fundee = sequelize.define('fundeetable', {
    id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    company_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    company_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    website: {
        type: DataTypes.STRING(255),
        defaultValue: 'unknown'
    },
    contact: {
        type: DataTypes.STRING(255),
        defaultValue: 'unknown'
    },
    headcount: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    project_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    project_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    project_status: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    method: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    certifier: {
        type: DataTypes.STRING(255),
        defaultValue: null
    },
    mcdr_type: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    founding_year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stage: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    current_funding: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    funding_requested: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_credits_issued: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    expected_credits: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    rawscore: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: false,
    tableName: 'fundeetable'
});

const Funders = sequelize.define('funderstable', {
  id: {
    type: DataTypes.INTEGER,
    defaultValue: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  organization_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING,
    unique: true,
  },
  website: {
    type: DataTypes.STRING
  },
  num_investments: {
    type: DataTypes.INTEGER
  },
  last_investment_date: {
    type: DataTypes.DATE
  },
  description: {
    type: DataTypes.TEXT
  },
  focus_areas: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  funding_stages: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  avg_investment_size: {
    type: DataTypes.INTEGER
  },
  longitude: {
    type: DataTypes.FLOAT
  },
  latitude: {
    type: DataTypes.FLOAT
  },
  geographic_focus: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  }
},
{
  timestamps: false,
  tableName: 'funderstable'
});


const mCDR_trials = sequelize.define('mcdr_trials', {
    id: {
      type: DataTypes.INTEGER,
      defaultValue: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    trial_name: {
      type: DataTypes.STRING,
      allowNull: false
    },  
    leading_organization: {
      type: DataTypes.STRING,
      allowNull: false
    },
    other_leading_organization: {
      type: DataTypes.STRING
    },
    organization_type: {
      type: DataTypes.STRING
    },
    all_cdr_methods: { //provide
        type: DataTypes.STRING
    },
    collaborators: {
        type: DataTypes.STRING
    },
    mrv_provider: {
        type: DataTypes.STRING
    },
    mrv_strategy: {
      type: DataTypes.STRING
    },
    monitoring_platforms: {
      type: DataTypes.STRING
    },
    measurements: {
      type: DataTypes.STRING
    },
},
{
  timestamps: false,
  tableName: 'mcdr_trials'
});


export { Fundee, Funders, mCDR_trials };