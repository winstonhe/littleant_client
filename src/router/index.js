import {createRouter, createWebHashHistory} from 'vue-router'

import Dashboard from '../components/Dashboard'
import ServiceTicketDetails from '../components/ServiceTicketDetails'
import GroupDashboard from '../components/GroupDashboard'
import GroupAssignment from '../components/GroupAssignment'
import GroupMonthlyMetrics from  '../components/GroupMonthlyMetrics'
import GroupBookableResources from '../components/GroupBookableResources'
import TeamMetricsInsight from '../components/TeamMetricsInsight'
import CustomerFocusCenter from '../components/CustomerFocusCenter'

const routes=[
   
    {
        path:'/',
        name:'Home',
        component:Dashboard
    },
    {
        path:'/ServiceTicketDetails',
        name:'Home',
        component:ServiceTicketDetails,
        meta: { title: 'Little Ant - Review' }
    },


    {
        path:'/Dashboard',
        name:'Dashboard',
        component:Dashboard,
        meta: { title: 'Little Ant - Dashboard' }
    },
    {
        path:'/groupdashboard',
        name:'groupdashboard',
        component:GroupDashboard,
        meta: { title: 'Little Ant - Group Dashboard' }
    },
    {
        path:'/groupmonthlymetrics',
        name:'GroupMonthlyMetrics',
        component:GroupMonthlyMetrics,
        meta: { title: 'Little Ant - Group Montly Metrics' }
    },
    {
        path:'/groupassignment',
        name:'GroupAssignment',
        component:GroupAssignment,
        meta: { title: 'Little Ant - Group Assignment' }
    },
    {
        path:'/groupresourcestatus',
        name:'groupresourcestatus',
        component:GroupBookableResources,
        meta: { title: 'Little Ant - Group Resource Status' }
    },
    {
        path:'/operationfootprint',
        name:'operationfootprint',
        component:TeamMetricsInsight,
        meta: { title: 'Little Ant - Teams Insights' }
    },
    {
        path:'/customerfocus',
        name:'customerfocus',
        component:CustomerFocusCenter,
        meta: { title: 'Little Ant - Customer Focus Center' }
    }
]

const router = createRouter({
    history: createWebHashHistory(),    
    routes,
})


export default router