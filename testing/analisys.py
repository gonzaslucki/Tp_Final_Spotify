import pandas as pd

# Load the csv file
df = pd.read_csv('../data3.csv')


# apply to every value of the df the formula (x-min(x))/(max(x)-min(x)). 
# This will make the values of each column to be between 0 and 1
df['tempo'] = df["tempo"].apply(lambda x: (x - min(df['tempo'])) / (max(df['tempo']) - min(df['tempo'])))
df['loudness'] = df["loudness"].apply(lambda x: (x - min(df['loudness'])) / (max(df['loudness']) - min(df['loudness'])))
mean_df = df.groupby('user').mean()




# # Calculate the mean for each user
# mean_df = df_norm.groupby('user').mean()


result = []

# Iterate over each row of the dataframe
for _, row in mean_df.iterrows():
    temp = []
    for column in mean_df.columns:
        if column != 'user':
            # the range of the values should be between 0 and 1
            # so we divide by the maximum value})
            temp.append({'axis': column, 'value': abs(row[column])})
    result.append(temp)

print(result)