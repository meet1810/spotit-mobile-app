import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, COMMON_STYLES } from '../styles/theme';
import IssueCard from '../components/IssueCard';
import { useMockContext } from '../utils/MockContext';
import { useLanguage } from '../utils/LanguageContext';
import Header from '../components/Header';

const IssuesScreen = ({ navigation }) => {
    const { issues, refreshIssues } = useMockContext();
    const { t } = useLanguage();
    const [filter, setFilter] = useState('All'); // All, Recent
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshIssues();
        setRefreshing(false);
    };

    const getFilteredIssues = () => {
        if (filter === 'Recent') {
            return issues.slice(0, 5);
        }
        return issues;
    };

    const renderFilterTab = (title) => (
        <TouchableOpacity
            style={[
                styles.filterTab,
                filter === title && styles.activeFilterTab
            ]}
            onPress={() => setFilter(title)}
        >
            <Text style={[
                styles.filterText,
                filter === title && styles.activeFilterText
            ]}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={COMMON_STYLES.container}>
            <Header title={t('issues')} />

            <View style={styles.filterContainer}>
                {renderFilterTab('All')}
                {renderFilterTab('Recent')}
            </View>

            <FlatList
                data={getFilteredIssues()}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('IssueDetail', { issue: item })}>
                        <IssueCard issue={item} />
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
                onRefresh={onRefresh}
                refreshing={refreshing}
                ListEmptyComponent={
                    <View style={COMMON_STYLES.center}>
                        <Text style={{ marginTop: 50, color: COLORS.textLight }}>Not any issue yet</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingTop: 50,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.secondary,
    },
    filterContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: COLORS.white,
    },
    filterTab: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#eee',
        marginRight: 10,
    },
    activeFilterTab: {
        backgroundColor: COLORS.primary,
    },
    filterText: {
        color: COLORS.text,
        fontWeight: '500',
    },
    activeFilterText: {
        color: COLORS.white,
    },
    listContent: {
        padding: 16,
    }
});

export default IssuesScreen;
